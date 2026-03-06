/**
 * Atmosphere — animated 3D fluid blob background.
 * Three large gradient orbs float independently with heavy blur,
 * creating an abstract flowing-fluid aesthetic. Purely CSS-driven.
 * Never interferes with interaction (pointer-events: none, fixed positioning).
 */
export default function Atmosphere() {
    return (
        <div
            className="fixed inset-0 pointer-events-none overflow-hidden"
            style={{ zIndex: 0 }}
            aria-hidden="true"
        >
            {/* Base dark gradient */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse 80% 80% at 50% 50%, #0a0e1a 0%, #060910 100%)',
                }}
            />

            {/* Fluid Blob 1 — Deep Blue / Cyan */}
            <div
                className="absolute animate-fluid-1 animate-blob-glow"
                style={{
                    width: '650px',
                    height: '650px',
                    left: '5%',
                    top: '15%',
                    borderRadius: '40% 60% 55% 45% / 55% 40% 60% 45%',
                    background: 'radial-gradient(circle at 40% 40%, rgba(14, 165, 233, 0.18), rgba(37, 99, 235, 0.08) 60%, transparent 80%)',
                    filter: 'blur(100px)',
                }}
            />

            {/* Fluid Blob 2 — Purple / Violet */}
            <div
                className="absolute animate-fluid-2 animate-blob-glow"
                style={{
                    width: '550px',
                    height: '550px',
                    right: '5%',
                    top: '5%',
                    borderRadius: '55% 45% 40% 60% / 45% 55% 45% 55%',
                    background: 'radial-gradient(circle at 60% 40%, rgba(124, 58, 237, 0.15), rgba(76, 29, 149, 0.08) 60%, transparent 80%)',
                    filter: 'blur(120px)',
                    animationDelay: '-5s',
                }}
            />

            {/* Fluid Blob 3 — Emerald / Teal */}
            <div
                className="absolute animate-fluid-3 animate-blob-glow"
                style={{
                    width: '500px',
                    height: '500px',
                    left: '30%',
                    bottom: '-5%',
                    borderRadius: '45% 55% 60% 40% / 60% 45% 55% 45%',
                    background: 'radial-gradient(circle at 50% 60%, rgba(16, 185, 129, 0.14), rgba(20, 184, 166, 0.06) 60%, transparent 80%)',
                    filter: 'blur(110px)',
                    animationDelay: '-10s',
                }}
            />

            {/* Noise texture — very subtle grain for depth */}
            <div
                className="absolute inset-0"
                style={{
                    opacity: 0.03,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: '256px 256px',
                }}
            />

            {/* Top edge accent line */}
            <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.2) 25%, rgba(124, 58, 237, 0.15) 50%, rgba(16, 185, 129, 0.15) 75%, transparent)',
                }}
            />
        </div>
    )
}
