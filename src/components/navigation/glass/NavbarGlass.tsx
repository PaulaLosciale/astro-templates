import { useState } from "react";

export default function NavbarGlass() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        background: "rgba(255, 255, 255, 0.1)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.25)",
        boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 2rem",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <a
          href="/glass"
          style={{
            fontSize: "1.5rem",
            fontWeight: "800",
            color: "#fff",
            textDecoration: "none",
            letterSpacing: "-0.5px",
          }}
        >
          Glass<span style={{ opacity: 0.6 }}>UI</span>
        </a>

        {/* Desktop nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2.5rem",
          }}
          className="glass-desktop-nav"
        >
          {["Features", "Pricing", "About", "Blog"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{
                color: "rgba(255,255,255,0.85)",
                textDecoration: "none",
                fontSize: "0.95rem",
                fontWeight: "500",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#fff")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.85)")
              }
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <a
          href="#get-started"
          style={{
            padding: "0.55rem 1.5rem",
            borderRadius: "100px",
            background: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.5)",
            backdropFilter: "blur(10px)",
            color: "#fff",
            fontWeight: "700",
            fontSize: "0.9rem",
            textDecoration: "none",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.35)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
          }
        >
          Get Started
        </a>
      </div>
    </nav>
  );
}
