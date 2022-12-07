import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useRoutes } from "react-router-dom"

import { ReactComponent as HistoryIcon } from "styles/images/menu/History.svg"
import { ReactComponent as SwapIcon } from "styles/images/menu/Swap.svg"
import { ReactComponent as StakeIcon } from "styles/images/menu/Stake.svg"
import { ReactComponent as GovernanceIcon } from "styles/images/menu/Governance.svg"
import { ReactComponent as ContractIcon } from "styles/images/menu/Contract.svg"
import { ReactComponent as SettingsIcon } from "styles/images/menu/Settings.svg"
import { ReactComponent as DashboardIcon } from "styles/images/menu/Dashboard.svg"
//import { ReactComponent as ContractIcon } from "styles/images/menu/Contract.svg"

/* menu */
import Dashboard from "pages/dashboard/Dashboard"
import History from "pages/history/History"
import Stake from "pages/stake/Stake"
import Governance from "pages/gov/Governance"
//import Contract from "pages/contract/Contract"

/* details */
import ValidatorDetails from "pages/stake/ValidatorDetails"
import ProposalDetails from "pages/gov/ProposalDetails"

/* txs */
import SendTx from "txs/send/SendTx"
import ConfirmTx from "txs/confirm/ConfirmTx"
import ConnectTx from "txs/connect/ConnectTx"
import TransferCW721Tx from "txs/wasm/TransferCW721Tx"
import SwapTx from "txs/swap/SwapTx"
import StakeTx from "txs/stake/StakeTx"
import WithdrawRewardsTx from "txs/stake/WithdrawRewardsTx"
import WithdrawCommissionTx from "txs/stake/WithdrawCommissionTx"
import SubmitProposalTx from "txs/gov/SubmitProposalTx"
import DepositTx from "txs/gov/DepositTx"
import VoteTx from "txs/gov/VoteTx"
import StoreCodeTx from "txs/wasm/StoreCodeTx"
import InstantiateContractTx from "txs/wasm/InstantiateContractTx"
import ExecuteContractTx from "txs/wasm/ExecuteContractTx"
import MigrateContractTx from "txs/wasm/MigrateContractTx"
import UpdateAdminContractTx from "txs/wasm/UpdateAdminContractTx"
import SignMultisigTxPage from "pages/multisig/SignMultisigTxPage"
import PostMultisigTxPage from "pages/multisig/PostMultisigTxPage"

/* auth */
import Auth from "auth/modules/Auth"
import ManageNetworksPage from "auth/networks/ManageNetworksPage"
import AddNetworkPage from "auth/networks/AddNetworkPage"

/* settings */
import Settings from "pages/Settings"

/* labs */
import Labs from "pages/labs/Labs"

/* 404 */
import NotFound from "pages/NotFound"
import DonateAllVestingTokensTx from "txs/stake/DonateAllVestingTokensTx"

/* Deep Link */
import WalletSettings from "../auth/modules/manage/WalletSettings"

const ICON_SIZE = { width: 20, height: 20 }

// TODO MAKE SURE THE ROUTES WERE MERGED CORRECTLY

export const useNav = () => {
  const { t } = useTranslation()

  const menu = [
    /*
    {
      path: "/",
      element: <Dashboard />,
      title: t("Dashboard"),
      icon: <WalletIcon {...ICON_SIZE} />,
    },
    */
    {
      path: "/",
      element: <SwapTx />,
      title: t("Swap"),
      icon: <SwapIcon {...ICON_SIZE} />,
    },
    {
      path: "/history",
      element: <History />,
      title: t("History"),
      icon: <HistoryIcon {...ICON_SIZE} />,
    },
    {
      path: "/swap",
      element: <SwapTx />,
      title: t("Swap"),
      icon: <SwapIcon {...ICON_SIZE} />,
    },
    {
      path: "/stake",
      element: <Stake />,
      title: t("Stake"),
      icon: <StakeIcon {...ICON_SIZE} />,
    },
    {
      path: "/gov",
      element: <Governance />,
      title: t("Governance"),
      icon: <GovernanceIcon {...ICON_SIZE} />,
    },
    /*
    {
      path: "/nft",
      element: <NFT />,
      title: t("NFT"),
      icon: <NFTIcon {...ICON_SIZE} />,
    },
    {
      path: "/contract",
      element: <Contract />,
      title: t("Contract"),
      icon: <ContractIcon {...ICON_SIZE} />,
    },
  ]
  */
  ]

  const subPage = [
    {
      path: "/confirm",
      title: "Confirm",
      element: <ConfirmTx />,
    },
    {
      path: "/connect",
      title: "",
      element: <ConnectTx />,
    },
  ]

  const routes = [
    /* pages */
    ...menu,
    { path: "/validator/:address", element: <ValidatorDetails /> },
    { path: "/proposal/:chain/:id", element: <ProposalDetails /> },

    /* multisig */
    { path: "/multisig/sign", element: <SignMultisigTxPage /> },
    { path: "/multisig/post", element: <PostMultisigTxPage /> },

    /* txs */
    { path: "/send", element: <SendTx /> },
    { path: "/confirm", element: <ConfirmTx /> },
    { path: "/nft/transfer", element: <TransferCW721Tx /> },
    { path: "/stake/:address", element: <StakeTx /> },
    { path: "/rewards", element: <WithdrawRewardsTx /> },
    { path: "/commission", element: <WithdrawCommissionTx /> },
    { path: "/proposal/new", element: <SubmitProposalTx /> },
    { path: "/proposal/:chain/:id/deposit", element: <DepositTx /> },
    { path: "/proposal/:chain/:id/vote", element: <VoteTx /> },
    { path: "/contract/instantiate", element: <InstantiateContractTx /> },
    { path: "/contract/store", element: <StoreCodeTx /> },
    { path: "/contract/execute/:contract", element: <ExecuteContractTx /> },
    { path: "/contract/migrate/:contract", element: <MigrateContractTx /> },
    {
      path: "/contract/updateadmin/:contract",
      element: <UpdateAdminContractTx />,
    },
    { path: "/donate", element: <DonateAllVestingTokensTx /> },

    /* auth */
    { path: "/auth/*", element: <Auth /> },
    { path: "/networks", element: <ManageNetworksPage /> },
    { path: "/network/new", element: <AddNetworkPage /> },
    { path: "/settings", element: <Settings /> },

    /* Deep Link */
    ...subPage,

    /* Mobile preference */
    {
      path: "/preference",
      element: <WalletSettings />,
    },

    /* dev */
    { path: "/labs", element: <Labs /> },

    /* 404 */
    { path: "*", element: <NotFound /> },
  ]

  const mobileMenu = [
    {
      path: "/",
      element: <Dashboard />,
      title: t("Dashboard"),
      icon: <DashboardIcon {...ICON_SIZE} />,
    },
    ...menu,
    {
      path: "/preference",
      element: <WalletSettings />,
      title: t("Settings"),
      icon: <SettingsIcon {...ICON_SIZE} />,
    },
  ]

  return { menu, mobileMenu, subPage, element: useRoutes(routes) }
}

/* helpers */
export const useGoBackOnError = ({ error }: QueryState) => {
  const navigate = useNavigate()
  useEffect(() => {
    if (error) navigate("..", { replace: true })
  }, [error, navigate])
}
