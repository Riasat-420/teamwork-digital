import { useState, type FormEvent } from "react";
import { ArrowRight, Check, LoaderCircle, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/portfolio-data";
import { getProjectGuide } from "@/lib/project-guide.functions";

type Guide = Awaited<ReturnType<typeof getProjectGuide>>;

export function ProjectGuide() {
  const [brief, setBrief] = useState("");
  const [guide, setGuide] = useState<Guide | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    if (brief.trim().length < 25) { setError("Please share a little more detail about your project (at least 25 characters)."); return; }
    setPending(true);
    setGuide(null);
    setError("");
    try { setGuide(await getProjectGuide({ data: { brief: brief.trim() } })); }
    catch (issue) { setError(issue instanceof Error ? issue.message : "We couldn't prepare recommendations right now. Please try again later."); }
    finally { setPending(false); }
  };

  return <section id="project-guide" className="portfolio-section guide-section" aria-labelledby="guide-heading">
    <div className="portfolio-container">
      <div className="guide-heading-row">
        <div><span className="portfolio-eyebrow"><span className="portfolio-dot" />Project planner</span><h2 id="guide-heading" className="portfolio-heading">Tell us your <em>idea.</em><br />Find your starting point.</h2></div>
        <p>Describe the project you're thinking about. Get a tailored shortlist of services and a practical way forward.</p>
      </div>
      <div className="guide-layout">
        <form className="guide-form" onSubmit={submit}>
          <label htmlFor="project-brief">Your project requirements</label>
          <textarea id="project-brief" name="brief" value={brief} onChange={event => { setBrief(event.target.value); if (error) setError(""); }} minLength={25} maxLength={3000} required placeholder="e.g. We want a mobile app for customers to book appointments, receive reminders and pay online..." aria-describedby="guide-note" />
          <div className="guide-form-footer"><span id="guide-note">Don't include private information. Your brief is used to create this suggestion, not saved here.</span><span>{brief.length}/3000</span></div>
          <Button type="submit" disabled={pending} className="guide-submit">{pending ? <LoaderCircle className="guide-spinner" size={17} /> : <Sparkles size={17} />}{pending ? "Preparing your plan…" : "Find matching services"}<ArrowRight size={16} /></Button>
          {error && <p role="alert" className="guide-error">{error}</p>}
        </form>
        <div className="guide-results" aria-live="polite" aria-busy={pending}>
          {pending ? <div className="guide-wait"><span className="guide-wait-mark"><LoaderCircle size={24} className="guide-spinner" /></span><h3>Finding the best fit</h3><p>Considering your brief against our services and process.</p></div> : guide ? <div className="guide-answer" key={guide.summary}>
            <span className="guide-result-label"><Check size={14} /> YOUR PROJECT PLAN</span>
            <h3>{guide.summary}</h3>
            <h4>Services that fit</h4>
            <div className="guide-matches">{guide.recommendations.map(({ service, reason }) => {
              const match = services.find(item => item.title === service);
              if (!match) return null;
              return <div key={service}><strong>{service}</strong><p>{reason}</p></div>;
            })}</div>
            <h4>Next steps</h4>
            <ol>{guide.nextSteps.map((step, index) => <li key={index}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>)}</ol>
            <div className="guide-question"><small>ONE THING TO CLARIFY</small><p>{guide.question}</p></div>
            <Button variant="outline" type="button" onClick={() => { setGuide(null); setError(""); }}><RotateCcw size={15} /> Refine your brief</Button>
          </div> : <div className="guide-empty"><span className="guide-empty-mark">✳</span><span className="guide-empty-index">TEAMWORK DIGITAL / PROJECT DISCOVERY</span><h3>A clear direction starts with a good brief.</h3><div className="guide-empty-rule" /><span className="guide-empty-bottom">YOUR IDEA <ArrowRight size={17} /> OUR EXPERTISE</span></div>}
        </div>
      </div>
    </div>
  </section>;
}