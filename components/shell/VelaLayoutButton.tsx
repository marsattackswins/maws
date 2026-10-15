"use client";

/**
 * MAWS's Layouts button — its dropdown is VELA's own layout picker (4×4 grid canvas,
 * registered presets the canvas cannot express, SYNC switches), not a MAWS menu.
 *
 * The picker is owned by the live VelaWorkspace (it needs the workspace root as its
 * token + positioning host), so this component only supplies the trigger, waits for
 * the workspace handle to appear (the host mounts after the topbar), and echoes the
 * panel's open state back into the button.
 */

import { LayoutGrid } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ToolbarBtn } from "@/components/ui/ToolbarBtn";
import { getWorkspace, subscribeWorkspace } from "@/lib/chart-registry";

export function VelaLayoutButton() {
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let dispose: (() => void) | null = null;
    const bind = () => {
      dispose?.();
      dispose = null;
      setOpen(false);
      const ws = getWorkspace();
      const trigger = triggerRef.current;
      if (ws && trigger) dispose = ws.mountLayoutPicker(trigger, setOpen);
    };
    const unsubscribe = subscribeWorkspace(bind);
    bind();
    return () => {
      unsubscribe();
      dispose?.();
    };
  }, []);

  return (
    <span ref={triggerRef} className="inline-flex">
      <ToolbarBtn label="Layouts" active={open}>
        <LayoutGrid size={15} />
      </ToolbarBtn>
    </span>
  );
}
