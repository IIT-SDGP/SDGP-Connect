// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { Contact, FolderGit2, Home, Info, Upload, Trophy } from "lucide-react";

export const sidebarItems = [
    { icon: Home, href: '/', label: 'Home' },
    { icon: FolderGit2, href: '/project', label: 'Projects' },
    { icon: Trophy, href: '/competitions', label: 'Competition Winners' },
    { icon: Info, href: '/about', label: 'About Us' },
    { icon: Contact, href: '/contact', label: 'Contact Us' },
    { icon: Upload, href: '/submit', label: 'Submit Details' },
  ];