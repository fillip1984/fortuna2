"use client";

import { useEffect, useState } from "react";

import {
  HiCalendarDays,
  HiChevronDoubleUp,
  HiChevronDown,
} from "react-icons/hi2";
import { IoScaleOutline } from "react-icons/io5";
import { MdOutlineBloodtype } from "react-icons/md";

import NewBloodPressureReading from "./NewBloodPressureReading";
import NewRoutine from "./NewRoutine";
import NewWeighIn from "./NewWeighIn";

export type DrawerFormOptions =
  | "Selector"
  | "Routine"
  | "Weigh In"
  | "Blood Pressure Reading";

export interface NavItem {
  label: string;
  icon: JSX.Element;
  //   href?: string;
  action: () => void;
}

export interface NewItemDrawerProps {
  setDrawerForm: React.Dispatch<React.SetStateAction<DrawerFormOptions>>;
  handleDrawerToggle: () => void;
}

export default function BottomNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerForm, setDrawerForm] = useState<DrawerFormOptions>("Selector");

  const navItems: NavItem[] = [
    {
      label: "New Routine",
      icon: <HiCalendarDays />,
      action: () => setDrawerForm("Routine"),
    },
    {
      label: "Weigh In",
      icon: <IoScaleOutline />,
      action: () => setDrawerForm("Weigh In"),
    },
    {
      label: "Blood Pressure Reading",
      icon: <MdOutlineBloodtype />,
      action: () => setDrawerForm("Blood Pressure Reading"),
    },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    // reset to selector view whenever drawer is shutdown
    if (!drawerOpen) {
      setDrawerForm("Selector");
    }
  }, [drawerOpen]);

  return (
    <>
      <div
        id="navbar"
        className="fixed bottom-0 left-0 right-0 flex items-center justify-around bg-black py-2"
      >
        <button onClick={handleDrawerToggle}>
          <HiChevronDoubleUp className="text-6xl text-red-400" />
        </button>
      </div>

      <div
        id="bottom-drawer"
        className={`fixed bottom-0 left-0 right-0 z-50 rounded-t bg-zinc-800 text-white transition-all duration-200 ${
          drawerOpen ? "h-full" : "h-0"
        }`}
      >
        <div id="drawer-controls" className="mt-2 flex justify-center text-6xl">
          <button type="button" onClick={handleDrawerToggle}>
            <HiChevronDown />
          </button>
        </div>
        {drawerForm === "Selector" && (
          <div className="selector mt-24 flex h-full w-full justify-center gap-2 p-4">
            {navItems.map((navItem, index) => (
              <button
                type="button"
                key={index}
                className="flex h-32 w-32 flex-col items-center justify-center rounded-lg border border-white p-2"
                onClick={navItem.action}
              >
                <span className="text-4xl">{navItem.icon}</span>
                <span className="text-xs">{navItem.label}</span>
              </button>
            ))}
          </div>
        )}

        {drawerForm === "Routine" && (
          <NewRoutine
            setDrawerForm={setDrawerForm}
            handleDrawerToggle={handleDrawerToggle}
          />
        )}

        {drawerForm === "Weigh In" && (
          <NewWeighIn
            setDrawerForm={setDrawerForm}
            handleDrawerToggle={handleDrawerToggle}
          />
        )}

        {drawerForm === "Blood Pressure Reading" && (
          <NewBloodPressureReading
            setDrawerForm={setDrawerForm}
            handleDrawerToggle={handleDrawerToggle}
          />
        )}
      </div>
    </>
  );
}
