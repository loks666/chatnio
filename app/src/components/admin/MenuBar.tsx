import { useDispatch, useSelector } from "react-redux";
import { closeMenu, selectMenu } from "@/store/menu.ts";
import React, { useMemo } from "react";
import {
  CandlestickChart,
  LayoutDashboard,
  Radio,
  Settings,
  Users,
} from "lucide-react";
import router from "@/router.tsx";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { mobile } from "@/utils/device.ts";

type MenuItemProps = {
  title: string;
  icon: React.ReactNode;
  path: string;
};

function MenuItem({ title, icon, path }: MenuItemProps) {
  const location = useLocation();
  const dispatch = useDispatch();
  const active = useMemo(
    () =>
      location.pathname === `/admin${path}` ||
      location.pathname + "/" === `/admin${path}`,
    [location.pathname, path],
  );

  const redirect = async () => {
    if (mobile) dispatch(closeMenu());
    await router.navigate(`/admin${path}`);
  };

  return (
    <div className={`menu-item ${active ? "active" : ""}`} onClick={redirect}>
      <div className={`menu-item-icon`}>{icon}</div>
      <div className={`menu-item-title`}>{title}</div>
    </div>
  );
}

function MenuBar() {
  const { t } = useTranslation();
  const open = useSelector(selectMenu);
  return (
    <div className={`admin-menu ${open ? "open" : ""}`}>
      <MenuItem
        title={t("admin.dashboard")}
        icon={<LayoutDashboard />}
        path={"/"}
      />
      <MenuItem title={t("admin.users")} icon={<Users />} path={"/users"} />
      <MenuItem
        title={t("admin.broadcast")}
        icon={<Radio />}
        path={"/broadcast"}
      />
      <MenuItem
        title={t("admin.channel")}
        icon={<Settings />}
        path={"/channel"}
      />
      <MenuItem
        title={t("admin.prize")}
        icon={<CandlestickChart />}
        path={"/charge"}
      />
    </div>
  );
}

export default MenuBar;
