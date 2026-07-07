// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import Carousel from "./carousel";
import MorphingText from "./Morphing";
import dynamic from "next/dynamic";

// Lazy-load motion components with better loading
const MotionDiv = dynamic(
	() => import("framer-motion").then((mod) => mod.motion.div),
	{
		ssr: false,
		loading: () => <div className="min-h-[50px]" /> // Prevent layout shift
	}
);

const MotionH1 = dynamic(
	() => import("framer-motion").then((mod) => mod.motion.h1),
	{
		ssr: false,
		loading: () => <h1 className="min-h-[40px]" /> // Prevent layout shift
	}
);

// Optimize Three.js scene loading
const ThreeScene = dynamic(() => import("./three-scene"), { 
	ssr: false,
	loading: () => <div className="min-h-[300px] bg-gradient-to-b from-transparent to-background/50" />
});

const Logo: React.FC = () => (
	<MotionDiv
		initial={{ scale: 1.8, opacity: 0 }}
		animate={{ scale: 2, opacity: 1 }}
		transition={{ duration: 0.5 }}
		className="mb-6 md:mb-10 flex justify-center items-center"
	>
		<div className="relative">
			<Image
				src="/test.svg"
				alt="SDGP Logo"
				className="lg:pl-2 pl-1 h-24 w-24 sm:h-52 sm:w-42 md:h-48 md:w-48 -mb-6 sm:-mb-8 md:-mb-17 -mt-4 sm:-mt-6 md:-mt-12"
				width={48}
				height={48}
				priority
			/>
		</div>
	</MotionDiv>
);

export default function ProjectHeroSection() {
	return (
		<section className="min-h-screen w-full flex flex-col overflow-hidden perspective-1000">
			{/* Banner at the top */}
			{/* No Banner3 for project hero */}
			<div className="flex-1 flex flex-col items-center justify-center relative">
				<ThreeScene />

				<MotionDiv
					className="relative z-10 text-center max-w-7xl px-6 flex flex-col gap-3 sm:gap-5 items-center justify-center"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					<MotionDiv
						className="inline-block px-4 sm:px-6 py-2 mb-2 text-xs sm:text-sm font-medium tracking-wider text-white bg-[#2a5298]/20 rounded-full border border-[#2a5298]/30"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						{"Innovative • Creative • Impactful"}
					</MotionDiv>

					<MotionH1
						className="text-6xl md:text-7xl font-bold  bg-gradient-to-r from-[#2a5298] via-[#9bb9ec] to-[#2a5298] bg-clip-text text-transparent "
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
					>
						<Logo />
					</MotionH1>

					<MotionDiv
						className=""
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6 }}
					>
						<MorphingText
							texts={[
								"Transforming Ideas Into Brands",
								"Crafting Digital Experiences",
								"Building Tomorrow's Solutions",
								"Creating Innovative Designs",
							]}
							className="text-xl md:text-2xl text-foreground/80  w-140 "
						/>
					</MotionDiv>

					<MotionDiv
						className="flex flex-col sm:flex-row justify-center gap-5 -mt-1"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8 }}
					>
						<div className="flex-1 z-10">
							<Link href="/project">
								<Button className="w-full px-8 py-3 rounded-full text-sm font-medium transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary/90">
									{"Explore projects"}
								</Button>
							</Link>
						</div>
						<div className="flex-1 z-10">
							<Link href="/about">
								<Button className="w-full px-8 py-3 rounded-full text-sm font-medium transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-primary/30">
									{"About Us"}
								</Button>
							</Link>
						</div>
						<div className="flex-1 -10">
							<a
								href="https://www.iit.ac.lk/"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Button className="w-full px-8 py-3 rounded-full text-sm font-medium transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary/90">
									{"Visit IIT"}
								</Button>
							</a>
						</div>
					</MotionDiv>

					<Carousel />
				</MotionDiv>
			</div>
		</section>
	);
}