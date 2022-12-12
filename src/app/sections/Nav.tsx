import { useEffect, useMemo, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { useRecoilState, useSetRecoilState } from "recoil"
import { useTranslation } from "react-i18next"
import classNames from "classnames/bind"
import { mobileIsMenuOpenState } from "components/layout"
import { useNav } from "../routes"
import styles from "./Nav.module.scss"
import { useThemeFavicon } from "data/settings/Theme"

import { ReactComponent as MenuIcon } from "styles/images/menu/Menu.svg"
import { ReactComponent as WalletIcon } from "styles/images/menu/Wallet.svg"
import { ReactComponent as SwapIcon } from "styles/images/menu/Swap.svg"
import { ReactComponent as StakeIcon } from "styles/images/menu/Stake.svg"
import { ReactComponent as ArrowUpIcon } from "styles/images/icons/ArrowUp.svg"

import is from "auth/scripts/is"
import QRScan from "./QRScan"
import { IconButton } from "@mui/material"
import { useIsMobile } from "../../auth/hooks/useIsMobile"
import { clearInterval } from "timers"

const cx = classNames.bind(styles)

const Nav = () => {
  useCloseMenuOnNavigate()
  const { t } = useTranslation()
  const { menu: defaultMenu, mobileMenu, subPage } = useNav()
  const icon = useThemeFavicon()
  const [isOpen, setIsOpen] = useRecoilState(mobileIsMenuOpenState)
  const toggle = () => setIsOpen(!isOpen)
  const close = () => setIsOpen(false)
  const ICON_SIZE = { width: 28, height: 28 }
  const { pathname } = useLocation()
  const [buttonView, setButtonView] = useState(true)
  const [isNeedMoreBtn, setIsNeedMoreBtn] = useState(false)

  useEffect(() => {
    const mainButtons = ["/wallet", "/swap", "/stake"]
    const subMenu = subPage.find((a) => a.path === pathname)
    const isMain = mainButtons.find((a) => a === pathname)
    if (isMain) {
      setIsNeedMoreBtn(false)
    } else {
      setIsNeedMoreBtn(true)
    }

    if (subMenu) {
      setButtonView(false)
    } else {
      setButtonView(true)
    }
  }, [pathname, subPage])

  const isMobile = useIsMobile()

  const menu = useMemo(
    () => (isMobile ? mobileMenu : defaultMenu),
    [isMobile, defaultMenu, mobileMenu]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      // setIsOpen((a) => !a);
    }, 5000)

    return () => clearInterval(interval)
  }, [setIsOpen])

  return buttonView ? (
    <nav
      className={classNames(
        styles.nav,
        isOpen ? styles.nav_open : styles.nav_closed
      )}
    >
      <div className={styles.nav_expand_button}>
        <IconButton onClick={toggle}>
          <ArrowUpIcon />
        </IconButton>
      </div>
      <header className={styles.header}>
        <a
          href="https://setup-station.terra.money/"
          target="_blank"
          rel="noreferrer"
          className={classNames(styles.item, styles.logo)}
        >
          <img src={icon} alt="Station" /> <strong>Station</strong>
        </a>

        {menu.map((item) => (
          <NavLink
            to={item.path}
            onClick={close}
            className={({ isActive }) =>
              cx(styles.mobileItem, { active: isActive })
            }
          >
            <>
              {item.icon}
              {t(item.title)}
            </>
          </NavLink>
        ))}
      </header>
    </nav>
  ) : (
    <></>
  )
}

export default Nav

/* hooks */
const useCloseMenuOnNavigate = () => {
  const { pathname } = useLocation()
  const setIsOpen = useSetRecoilState(mobileIsMenuOpenState)

  useEffect(() => {
    setIsOpen(false)
  }, [pathname, setIsOpen])
}
