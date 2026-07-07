// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

export function CornerBrackets() {
    return (
        <>
            <span className="absolute top-[-1px] left-[-1px] w-[14px] h-[14px] border-t-2 border-l-2 border-zinc-600 rounded-tl-[3px] transition-colors duration-300 group-hover:border-zinc-400" />
            <span className="absolute top-[-1px] right-[-1px] w-[14px] h-[14px] border-t-2 border-r-2 border-zinc-600 rounded-tr-[3px] transition-colors duration-300 group-hover:border-zinc-400" />
            <span className="absolute bottom-[-1px] left-[-1px] w-[14px] h-[14px] border-b-2 border-l-2 border-zinc-600 rounded-bl-[3px] transition-colors duration-300 group-hover:border-zinc-400" />
            <span className="absolute bottom-[-1px] right-[-1px] w-[14px] h-[14px] border-b-2 border-r-2 border-zinc-600 rounded-br-[3px] transition-colors duration-300 group-hover:border-zinc-400" />
        </>
    );
}