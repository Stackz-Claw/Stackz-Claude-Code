// Obsidian deep link utilities
// Every [Open in Obsidian] button should use these helpers

const DEFAULT_VAULT = import.meta.env.VITE_OBSIDIAN_VAULT_NAME || 'Agency HQ';

/**
 * Create an Obsidian deep link for a vault file
 * @param {string} vaultName - The name of the Obsidian vault
 * @param {string} filePath - Path to the file within the vault (no leading slash, no .md extension needed)
 * @returns {string} obsidian:// URL
 */
export function obsidianLink(vaultName, filePath) {
  const encodedVault = encodeURIComponent(vaultName);
  // Remove .md extension if present
  const cleanPath = filePath.replace(/\.md$/, '');
  const encodedPath = encodeURIComponent(cleanPath);
  return `obsidian://open?vault=${encodedVault}&file=${encodedPath}`;
}

/**
 * Hook to open files in Obsidian
 * @returns {function} Function to open a path in Obsidian
 */
export function useObsidianOpen() {
  return (path) => {
    const vault = import.meta.env.VITE_OBSIDIAN_VAULT_NAME || DEFAULT_VAULT;
    window.location.href = obsidianLink(vault, path);
  };
}

/**
 * Get a click handler for opening a file in Obsidian
 * @param {string} path - Path to the file within the vault
 * @returns {function} Click handler
 */
export function useObsidianClickHandler(path) {
  const open = useObsidianOpen();
  return (e) => {
    e.preventDefault();
    e.stopPropagation();
    open(path);
  };
}

/**
 * Create a link to a specific heading within a note
 * @param {string} vaultName - The vault name
 * @param {string} filePath - Path to the file
 * @param {string} heading - Heading text to link to
 * @returns {string} obsidian:// URL with heading
 */
export function obsidianHeadingLink(vaultName, filePath, heading) {
  const encodedVault = encodeURIComponent(vaultName);
  const cleanPath = filePath.replace(/\.md$/, '');
  const encodedPath = encodeURIComponent(cleanPath);
  const encodedHeading = encodeURIComponent(heading.replace(/^#+\s*/, ''));
  return `obsidian://open?vault=${encodedVault}&file=${encodedPath}&heading=${encodedHeading}`;
}