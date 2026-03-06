/**
 * Atmosphere — persistent ambient background layer.
 * Multi-layer radial gradients + SVG noise for depth.
 * Never interferes with interaction (pointer-events: none, fixed positioning).
 */
export default function Atmosphere() {
    return (
        <div
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 0 }}
            aria-hidden="true"
        >
            {/* Gradient mesh — warm + cool spots */}
            <div
                className="absolute inset-0"
                style={{
                    background: `
            radial-gradient(ellipse 60% 50% at 10% 90%, rgba(14, 165, 233, 0.04) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 85% 20%, rgba(16, 185, 129, 0.03) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(99, 102, 241, 0.02) 0%, transparent 60%),
            radial-gradient(ellipse 70% 50% at 90% 85%, rgba(245, 158, 11, 0.015) 0%, transparent 60%)
          `,
                }}
            />

            {/* Noise texture — very subtle grain for depth */}
            <div
                className="absolute inset-0"
                style={{
                    opacity: 0.025,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: '256px 256px',
                }}
            />

            {/* Top edge fade — subtle highlight */}
            <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.15) 30%, rgba(16, 185, 129, 0.1) 70%, transparent)',
                }}
            />
        </div>
    )
}
