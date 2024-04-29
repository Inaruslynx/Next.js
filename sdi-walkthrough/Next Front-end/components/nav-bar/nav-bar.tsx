"use client";
import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  OrganizationSwitcher,
} from "@clerk/nextjs";
import NavLink from "./nav-link";
import NavDropdown from "./nav-dropdown";
import ThemeSelector from "./theme-selector/theme-selector";
import { getDepartmentData } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Department } from "@/types";

export default function NavBar() {
  // const [departments, setDepartments] = useState<Department[]>([]);
  const departments = useQuery<Department[], Error>({
    queryKey: ["departments"],
    queryFn: getDepartmentData,
    staleTime: 1000 * 60 * 5, // ms * s * m
  });

  return (
    <>
      <header className="row row-span-1 bg-base-300 z-40 container fixed top-0 max-w-full">
        <nav className="p-4 navbar bg-base-300">
          <div className="navbar-start">
            {/* Below is UI for small screens  */}
            <div className="dropdown lg:hidden">
              <label tabIndex={0} className="btn btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <NavLink href="/">Home</NavLink>
                </li>
                {departments.data?.map((department) => (
                  <details key={department.name} className="collapse">
                    <summary className="collapse-title">
                      {department.name}
                    </summary>
                    <div className="collapse-content">
                      <li>
                        <NavLink href={`/${department.name}/walkthrough/`}>
                          Walk-through
                        </NavLink>
                      </li>
                      <li>
                        <NavLink href={`/${department.name}/graph/`}>
                          Graph
                        </NavLink>
                      </li>
                      <li>
                        <NavLink href={`/${department.name}/report/`}>
                          Report
                        </NavLink>
                      </li>
                    </div>
                  </details>
                ))}
              </ul>
            </div>

            {/* This is the UI for large screens */}
            <div className="hidden lg:flex">
              <NavLink button href="/">
                Home
              </NavLink>
              {departments.data?.map((department) => (
                <NavDropdown name={department.name} key={department.name} />
              ))}
            </div>
          </div>
          <div className="flex-none navbar-end">
            <SignedIn>
              <OrganizationSwitcher
                appearance={{
                  elements: {
                    organizationPreview: "text-base-content",
                    userPreviewTextContainer: "text-base-content",
                    organizationSwitcherTriggerIcon: "stroke-base-content",
                    organizationSwitcherPopoverCard:
                      "bg-base-200 text-base-content",
                    organizationSwitcherPopoverActionButtonText:
                      "text-base-content",
                    organizationSwitcherPopoverActionButtonIcon:
                      "stroke-base-content",
                    organizationPreviewSecondaryIdentifier: "text-base-content",
                    organizationSwitcherPopoverFooter:
                      "text-base-content stroke-base-content",
                    organizationSwitcherPreviewButton: "text-base-content",
                  },
                }}
              />
              <div className="p-2">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonPopoverCard: "bg-base-200 text-base-content",
                      userButtonPopoverActionButtonText: "text-base-content",
                      userButtonPopoverActionButtonIcon: "stroke-base-content",
                      userPreviewSecondaryIdentifier: "text-base-content",
                      userButtonPopoverFooter:
                        "text-base-content stroke-base-content",
                    },
                  }}
                />
              </div>
            </SignedIn>
            <SignedOut>
              <div className="px-4 mx-2 btn rounded-btn hover:btn-primary">
                <SignInButton />
              </div>
              <div className="px-4 mx-2 btn rounded-btn hover:btn-primary">
                <SignUpButton />
              </div>
            </SignedOut>
            <div className="hidden lg:contents">
              <ThemeSelector />
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
