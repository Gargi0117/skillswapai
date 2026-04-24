import { createFileRoute, useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/skill/$name")({
  component: SkillPage,
});

const skillData: any = {
  "Web Development": {
    description: "Learn how to build modern websites and web applications.",
    topics: ["HTML, CSS", "JavaScript", "React", "Backend", "Databases"],
    resources: [
      { name: "W3Schools", link: "https://www.w3schools.com/" },
      { name: "GeeksforGeeks", link: "https://www.geeksforgeeks.org/web-development/" },
      { name: "MDN Docs", link: "https://developer.mozilla.org/" },
    ],
  },

  "UI/UX Design": {
    description: "Design beautiful and user-friendly interfaces.",
    topics: ["Figma", "Wireframing", "Prototyping", "User Research"],
    resources: [
      { name: "Figma Learn", link: "https://help.figma.com/" },
      { name: "UX Design CC", link: "https://uxdesign.cc/" },
      { name: "Interaction Design Foundation", link: "https://www.interaction-design.org/" },
    ],
  },

  "English Speaking": {
    description: "Improve your spoken English and communication.",
    topics: ["Grammar", "Vocabulary", "Fluency", "Speaking Practice"],
    resources: [
      { name: "BBC Learning English", link: "https://www.bbc.co.uk/learningenglish" },
      { name: "Grammarly Blog", link: "https://www.grammarly.com/blog/" },
      { name: "Cambridge English", link: "https://www.cambridgeenglish.org/" },
    ],
  },

  "DSA & Coding": {
    description: "Master problem solving and coding interviews.",
    topics: ["Arrays", "Trees", "Graphs", "DP"],
    resources: [
      { name: "GeeksforGeeks DSA", link: "https://www.geeksforgeeks.org/data-structures/" },
      { name: "LeetCode", link: "https://leetcode.com/" },
      { name: "Codeforces", link: "https://codeforces.com/" },
    ],
  },

  "Stock Trading": {
    description: "Learn trading and financial markets.",
    topics: ["Technical Analysis", "Fundamentals", "Risk Management"],
    resources: [
      { name: "Investopedia", link: "https://www.investopedia.com/" },
      { name: "TradingView", link: "https://www.tradingview.com/" },
      { name: "Zerodha Varsity", link: "https://zerodha.com/varsity/" },
    ],
  },

  "Fitness Training": {
    description: "Build a healthy and fit lifestyle.",
    topics: ["Workout", "Diet", "Strength Training"],
    resources: [
      { name: "Healthline", link: "https://www.healthline.com/" },
      { name: "Bodybuilding", link: "https://www.bodybuilding.com/" },
      { name: "Nike Training Club", link: "https://www.nike.com/ntc-app" },
    ],
  },

  "Video Editing": {
    description: "Create professional videos and content.",
    topics: ["Editing", "Transitions", "Color Grading"],
    resources: [
      { name: "Premiere Pro Tutorials", link: "https://helpx.adobe.com/premiere-pro/tutorials.html" },
      { name: "CapCut Guide", link: "https://www.capcut.com/" },
      { name: "Filmora Learning", link: "https://filmora.wondershare.com/video-editing-tips/" },
    ],
  },

  "Interview Prep": {
    description: "Prepare for interviews and crack jobs.",
    topics: ["HR Questions", "Technical", "Mock Interviews"],
    resources: [
      { name: "GeeksforGeeks Interview", link: "https://www.geeksforgeeks.org/interview-preparation/" },
      { name: "InterviewBit", link: "https://www.interviewbit.com/" },
      { name: "Glassdoor Questions", link: "https://www.glassdoor.co.in/Interview/index.htm" },
    ],
  },
};

function SkillPage() {
  const { name } = useParams({ from: "/skill/$name" });

  const skill = skillData[name as keyof typeof skillData];

  if (!skill) {
    return <div className="p-10">Skill not found</div>;
  }

  return (
    <div className="min-h-screen px-6 py-12 max-w-5xl mx-auto">

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold mb-4"
      >
        {name}
      </motion.h1>

      {/* Description */}
      <p className="text-muted-foreground mb-8">
        {skill.description}
      </p>

      {/* Topics */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-2">📘 Topics Covered</h2>
        <ul className="list-disc ml-5 text-sm text-muted-foreground">
          {skill.topics.map((t: string) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>

      {/* Resources */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-2">🌐 Learning Resources</h2>

        <div className="grid gap-3">
          {skill.resources.map((res: any) => (
            <a
              key={res.name}
              href={res.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border p-4 hover:shadow-glow transition bg-card/60 backdrop-blur"
            >
              <div className="font-medium">{res.name}</div>
              <div className="text-xs text-muted-foreground">{res.link}</div>
            </a>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Button className="mt-6 bg-gradient-primary text-primary-foreground shadow-glow">
        Start Learning
      </Button>
    </div>
  );
}
