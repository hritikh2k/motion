"use client";
import { cn } from "@/lib/utils";
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import UserItem from "./userItem";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Item } from "./item";
import { toast } from "sonner";
import { DocumentList } from "./documentList";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TrashBox from "./trashbox";
import { useSearch } from "@/hooks/useSearch";
import { useSetting } from "@/hooks/useSetting";
import { Navbar } from "./navbar";

const Navigation = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const pathname = usePathname();
  const isResizingRef = useRef(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const search = useSearch()
  const create = useMutation(api.documents.create);
  const settings = useSetting()
  const param = useParams();
  const router = useRouter();

  const onCreateHandler = () => {
    const promise = create({ title: "Untitiled" })
      .then((DocumentIdPage) => router.push(`/documents/${DocumentIdPage}`));
    toast.promise(promise, {
      loading: "Creating document",
      success: "Created successfully",
      error: "Something went wrong ",
    });
  };
  useEffect(() => {
    if (isMobile) {
      handleCollaps();
    } else {
      handleResetWidth();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      handleCollaps();
    }
  }, [pathname, isMobile]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;
    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;
    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`,
      );
    }
  };
  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleResetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);
      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)",
      );
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const handleCollaps = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);
      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("left", "0");
      navbarRef.current.style.setProperty("width", "100%");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary  overflow-y-auto relative flex w-60 flex-col z-[99999]",
          isMobile && "w-0 overflow-hidden",
          isResetting && "transition-all duration-300 ease-in-out",
        )}
      >
        <div
          role="button"
          onClick={handleCollaps}
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100",
            isMobile && "opacity-100",
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <UserItem />
          <Item onClick={settings.onOpen} label="Setting" icon={Settings} />
          <Item onClick={search.onOpen} label="Search" icon={Search} isSearch />

          <Item onClick={onCreateHandler} label="New page" icon={PlusCircle} />
        </div>
        <div className="mt-4">
          <DocumentList />
          <Item onClick={onCreateHandler} icon={Plus} label="Add new page" />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item icon={Trash} label="Trash"></Item>
            </PopoverTrigger>
            <PopoverContent
              side={isMobile ? "bottom" : "right"}
              className="p-0 w-72"
              onClick={() => { }}
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={handleResetWidth}
          className="opacity group-hover/sidebar:opacity-100 cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all duration-300 ease-in-out",
          isMobile && "left-0 w-full",
        )}
      >
        {!!param.documentId ? (<Navbar
          isCollapsed={isCollapsed}
          onResetWidth={handleResetWidth}
        />
        ) : (
          <nav
            onClick={handleResetWidth}
            className="bg-transparent px-3 py-2 w-full "
          >
            {isCollapsed && (
              <MenuIcon role="button" className="w-6 h-6 text-muted-foreground" />
            )}
          </nav>
        )}
      </div>
    </>
  );
};

export default Navigation;
