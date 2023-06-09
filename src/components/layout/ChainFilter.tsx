import classNames from "classnames"
import { useNetwork } from "data/wallet"
import { useState, memo, useMemo, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import styles from "./ChainFilter.module.scss"
import { useSavedChain } from "utils/localStorage"
import { isTerraChain } from "utils/chain"
import { OtherChainsButton } from "components/layout"
import { useSortedDisplayChains } from "utils/chain"
import { useSelectedDisplayChain, useDisplayChains } from "utils/localStorage"

type Props = {
  children: (chain?: string) => React.ReactNode
  all?: boolean
  outside?: boolean
  title?: string
  className?: string
  terraOnly?: boolean
}

const cx = classNames.bind(styles)

const ChainFilter = ({
  children,
  all,
  outside,
  title,
  className,
  terraOnly,
}: Props) => {
  const { t } = useTranslation()
  const { savedChain, changeSavedChain } = useSavedChain()
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const network = useNetwork()
  const { displayChains } = useDisplayChains()
  const { selectedDisplayChain, changeSelectedDisplayChain } =
    useSelectedDisplayChain()
  const sortedDisplayChains = useSortedDisplayChains()

  useEffect(() => {
    const getwidth = () => {
      if (!ref.current) return
      setWidth(ref.current.offsetWidth)
    }
    getwidth()
    window.addEventListener("resize", getwidth)
    return () => window.removeEventListener("resize", getwidth)
  }, [])

  const networks = useMemo(
    () =>
      sortedDisplayChains
        .map((id) => network[id])
        .filter((n) => displayChains.includes(n?.chainID)),
    [network, sortedDisplayChains, displayChains]
  )

  const getUIWidth = (networkName: string) => {
    const container = document.createElement("button")
    container.style.gap = "0.5rem"
    container.style.minWidth = "4rem"
    container.style.border = "var(--border-width) solid var(--card-border)"
    container.style.borderRadius = "1rem"
    container.style.padding = "0.1rem 1rem"
    container.style.color = "var(--text-muted)"
    container.style.boxShadow = "inset 0px 0px 0 0.5px var(--card-border)"
    container.style.opacity = "0.75"
    container.innerHTML = networkName

    ref.current?.appendChild(container)
    const textWidth = container.offsetWidth
    ref.current?.removeChild(container)

    const insideGap = 8 // gap: 0.5rem;
    const imageWidth = 18 // likely max width of image
    const outsideGap = 6.4 // gap: 0.4rem;
    const fullWidth = textWidth + insideGap + outsideGap + imageWidth
    return fullWidth
  }

  const displayChainMax = useMemo(() => {
    let count = 0
    let calculatedWidth = all ? 80 : 0 // 80 is roughly the width of the "All" button
    let chainOverflowWidth = 80

    let chainNameList = [] as string[]

    for (let i = 0; i < networks.length; i++) {
      const fullWidth = getUIWidth(networks[i].name)

      calculatedWidth += fullWidth

      if (width - chainOverflowWidth > calculatedWidth) {
        chainNameList.push(networks[i].chainID)
        count++
      } else {
        break
      }
    }

    return { count, chainNameList }
  }, [all, networks, width])

  const networksToShow = useMemo(() => {
    let toShow
    const { count, chainNameList } = displayChainMax

    if (terraOnly) {
      toShow = Object.values(network).filter((n) => isTerraChain(n.prefix))
    } else if (selectedDisplayChain && selectedDisplayChain !== "undefined") {
      toShow = [...networks.slice(0, count)]

      if (!chainNameList.includes(selectedDisplayChain)) {
        toShow = [
          ...networks.slice(0, count - 1),
          network[selectedDisplayChain],
        ]
      }
    } else {
      toShow = networks.slice(0, count)
    }
    return Array.from(new Set(toShow))
  }, [networks, network, terraOnly, displayChainMax, selectedDisplayChain])

  const otherNetworks = useMemo(
    () => Object.values(network).filter((n) => !networksToShow.includes(n)),
    [network, networksToShow]
  )

  const initNetwork =
    networks.find((n) => n.chainID === savedChain) ?? networks[0]

  const [selectedChain, setChain] = useState<string | undefined>(
    all ? undefined : initNetwork?.chainID
  )

  const handleSetChain = (chain: string | undefined) => {
    setChain(chain)
    if (terraOnly) return
    changeSavedChain(chain)
    changeSelectedDisplayChain(chain)
  }

  return (
    <div className={outside ? styles.chainfilter__out : styles.chainfilter}>
      <div
        className={cx(className, styles.header, terraOnly ? styles.swap : "")}
      >
        {title && <h1>{title}</h1>}
        <div className={styles.pills} ref={ref}>
          {all && (
            <button
              onClick={() => handleSetChain(undefined)}
              className={cx(
                styles.all,
                styles.button,
                selectedChain ?? styles.active
              )}
            >
              {t("All")}
            </button>
          )}
          {networksToShow.map((c) => (
            <button
              key={c?.chainID}
              onClick={() => handleSetChain(c?.chainID)}
              className={cx(
                styles.button,
                selectedChain === c?.chainID ? styles.active : undefined
              )}
            >
              <img src={c?.icon} alt={c?.name} />
              {c?.name}
            </button>
          ))}
          {!terraOnly && (
            <OtherChainsButton
              handleSetChain={handleSetChain}
              list={otherNetworks}
            />
          )}
        </div>
      </div>
      <div className={styles.content}>{children(selectedChain)}</div>
    </div>
  )
}

export default memo(ChainFilter)
