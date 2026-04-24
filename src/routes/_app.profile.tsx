import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Plus, X, Pencil, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";

const REVIEWS = [
  { name: "Priya N.", text: "Amazing teacher! Super patient and clear.", rating: 5 },
  { name: "Tomás S.", text: "Practical, fun, and energetic sessions.", rating: 5 },
  { name: "Lina R.", text: "Helped me ace my interview prep.", rating: 4 },
];

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, updateUser } = useApp();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");

  const save = () => {
    updateUser({ name, bio });
    setEditing(false);
    toast.success("Profile updated");
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    updateUser({ skillsOffered: [...user.skillsOffered, newSkill.trim()] });
    setNewSkill("");
  };
  const removeSkill = (s: string) =>
    updateUser({ skillsOffered: user.skillsOffered.filter((x) => x !== s) });

  const addInterest = () => {
    if (!newInterest.trim()) return;
    updateUser({ learningInterests: [...user.learningInterests, newInterest.trim()] });
    setNewInterest("");
  };
  const removeInterest = (s: string) =>
    updateUser({ learningInterests: user.learningInterests.filter((x) => x !== s) });

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Your profile"
        subtitle="What others see when you teach or match."
        action={
          editing ? (
            <Button onClick={save} className="bg-gradient-primary text-primary-foreground"><Save className="mr-1 h-4 w-4" /> Save</Button>
          ) : (
            <Button onClick={() => setEditing(true)} variant="outline"><Pencil className="mr-1 h-4 w-4" /> Edit</Button>
          )
        }
      />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden p-0">
          <div className="h-32 bg-gradient-primary" />
          <div className="px-6 pb-6">
            <Avatar className="-mt-12 h-24 w-24 border-4 border-card shadow-elegant">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="mt-3">
              {editing ? (
                <Input value={name} onChange={(e) => setName(e.target.value)} className="font-display text-xl font-bold" />
              ) : (
                <h2 className="font-display text-2xl font-extrabold">{user.name}</h2>
              )}
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
            <div className="mt-3">
              {editing ? (
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
              ) : (
                <p className="text-sm text-muted-foreground">{user.bio}</p>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-3 font-display text-lg font-bold">Skills offered</h3>
          <div className="flex flex-wrap gap-2">
            {user.skillsOffered.map((s) => (
              <Badge key={s} variant="secondary" className="gap-1.5 px-3 py-1.5 text-xs">
                {s}
                <button onClick={() => removeSkill(s)} className="text-muted-foreground hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add a skill…" onKeyDown={(e) => e.key === "Enter" && addSkill()} />
            <Button size="icon" variant="outline" onClick={addSkill}><Plus className="h-4 w-4" /></Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-3 font-display text-lg font-bold">Learning interests</h3>
          <div className="flex flex-wrap gap-2">
            {user.learningInterests.map((s) => (
              <Badge key={s} className="gap-1.5 bg-gradient-primary px-3 py-1.5 text-xs text-primary-foreground">
                {s}
                <button onClick={() => removeInterest(s)} className="opacity-80 hover:opacity-100">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <Input value={newInterest} onChange={(e) => setNewInterest(e.target.value)} placeholder="Add an interest…" onKeyDown={(e) => e.key === "Enter" && addInterest()} />
            <Button size="icon" variant="outline" onClick={addInterest}><Plus className="h-4 w-4" /></Button>
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold">Ratings & reviews</h3>
          <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
            <Star className="h-4 w-4 fill-current" /> 4.9 <span className="font-normal text-muted-foreground">· 47 reviews</span>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <Card key={r.name} className="bg-muted/30 p-4">
              <div className="mb-1 flex items-center gap-1 text-xs font-bold text-amber-500">
                {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
              </div>
              <p className="text-sm">{r.text}</p>
              <div className="mt-2 text-xs text-muted-foreground">— {r.name}</div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
