// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { CTASection } from '@/components/about/cta';
import Hero from '@/components/about/hero';
import ModuleTeam from '@/components/about/moduleTeam';
import StatsSection from '@/components/about/stats';

import React from 'react';

interface Props {

}

const Page: React.FC<Props> = (props) => {

    return (
        <div className="">
            <Hero />
            <ModuleTeam />
            <StatsSection />
            <CTASection />


        </div>
    );
};

export default Page;