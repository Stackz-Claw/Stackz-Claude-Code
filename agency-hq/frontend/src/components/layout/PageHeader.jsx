import { motion } from 'framer-motion'

/**
 * PageHeader — Standardized page header across all views.
 * Replaces the repeated header pattern in every page file.
 *
 * @param {string} title - Main title text
 * @param {string} accent - Highlighted portion of the title
 * @param {string} accentColor - CSS class for accent (e.g. 'neon-text-blue')
 * @param {string} subtitle - Monospaced subtitle text
 * @param {React.ReactNode} actions - Optional right-side actions
 */
export default function PageHeader({
    title,
    accent,
    accentColor = 'neon-text-blue',
    subtitle,
    actions,
}) {
    return (
        <motion.div
            className="flex items-end justify-between flex-shrink-0"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
        >
            <div>
                <h2 className="text-xl font-display font-bold text-white tracking-tight">
                    {title}{' '}
                    <span className={accentColor}>{accent}</span>
                </h2>
                {subtitle && (
                    <p className="text-xs text-white/30 font-mono mt-0.5">{subtitle}</p>
                )}
            </div>
            {actions && <div className="flex items-center gap-2 pb-0.5">{actions}</div>}
        </motion.div>
    )
}
