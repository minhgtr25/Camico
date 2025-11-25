"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <>
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 relative">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center overflow-hidden h-16">
              <Image
                src="/images/colored-logo.png"
                alt="CAMICO - Green Feed For Sustainable Farming"
                width={300}
                height={100}
                className="h-20 w-auto scale-150"
                priority
              />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/san-pham" className="text-base hover:opacity-80 transition-opacity">
                Sản phẩm
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button
                  className="text-base hover:opacity-80 transition-opacity flex items-center gap-1"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  Về chúng tôi
                  <svg
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2">
                    <Link
                      href="/ve-chung-toi/thong-diep"
                      className="block px-4 py-2 text-base hover:bg-gray-100 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Thông điệp
                    </Link>
                    <Link
                      href="/ve-chung-toi/su-menh"
                      className="block px-4 py-2 text-base hover:bg-gray-100 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Sứ mệnh
                    </Link>
                    <Link
                      href="/ve-chung-toi/doi-tac"
                      className="block px-4 py-2 text-base hover:bg-gray-100 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Đối tác
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/tin-tuc" className="text-base hover:opacity-80 transition-opacity">
                Tin tức
              </Link>
              <Link href="/lien-he" className="text-base hover:opacity-80 transition-opacity">
                Liên hệ
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <nav
          className={`absolute top-full left-0 right-0 bg-primary text-primary-foreground md:hidden shadow-2xl overflow-y-auto max-h-[calc(100vh-4rem)] transition-all duration-300 ease-out ${
            isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="p-6 space-y-6">
            <Link
              href="/san-pham"
              className="block text-base hover:opacity-80 transition-opacity py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sản phẩm
            </Link>

            {/* Mobile dropdown for "Về chúng tôi" */}
            <div>
              <button
                className="w-full text-left text-base hover:opacity-80 transition-opacity flex items-center justify-between py-2"
                onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
              >
                Về chúng tôi
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${isMobileDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isMobileDropdownOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="mt-2 ml-4 space-y-3">
                  <Link
                    href="/ve-chung-toi/thong-diep"
                    className="block text-sm hover:opacity-80 transition-opacity py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Thông điệp
                  </Link>
                  <Link
                    href="/ve-chung-toi/su-menh"
                    className="block text-sm hover:opacity-80 transition-opacity py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sứ mệnh
                  </Link>
                  <Link
                    href="/ve-chung-toi/doi-tac"
                    className="block text-sm hover:opacity-80 transition-opacity py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đối tác
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/tin-tuc"
              className="block text-base hover:opacity-80 transition-opacity py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tin tức
            </Link>
            <Link
              href="/lien-he"
              className="block text-base hover:opacity-80 transition-opacity py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Liên hệ
            </Link>
          </div>
        </nav>
      </header>

      {isMobileMenuOpen && (
        <button
          className="fixed inset-0 bg-black/50 z-40 md:hidden cursor-pointer"
          onClick={() => setIsMobileMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsMobileMenuOpen(false)
            }
          }}
          aria-label="Close menu"
          type="button"
        />
      )}
    </>
  )
}
