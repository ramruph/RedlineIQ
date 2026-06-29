import { useState } from 'react';
import { CarFront, ClipboardList, Send } from 'lucide-react';
import { FieldLabel, Panel, SectionTitle } from './ui';

type IntakeMode = 'vehicle_request' | 'current_build';

export function IntakePage() {
  const [mode, setMode] = useState<IntakeMode>('vehicle_request');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    const existing = JSON.parse(localStorage.getItem('redlineiq_intake_submissions') ?? '[]');
    const submission = {
      type: mode,
      payload,
      created_at: new Date().toISOString(),
    };

    localStorage.setItem('redlineiq_intake_submissions', JSON.stringify([submission, ...existing]));
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <SectionTitle
            eyebrow="User Intake"
            title="Help Shape RedlineIQ"
            subtitle="Request future vehicles or submit your current build so the recommendation engine can evolve around real enthusiast needs."
          />

          <div className="flex gap-2">
            <button
              onClick={() => {
                setMode('vehicle_request');
                setSubmitted(false);
              }}
              className={`px-4 py-2 font-headline text-xs font-black uppercase tracking-widest ${
                mode === 'vehicle_request' ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant'
              }`}
            >
              Request Car
            </button>

            <button
              onClick={() => {
                setMode('current_build');
                setSubmitted(false);
              }}
              className={`px-4 py-2 font-headline text-xs font-black uppercase tracking-widest ${
                mode === 'current_build' ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant'
              }`}
            >
              Submit Build
            </button>
          </div>
        </div>

        <p className="mb-5 border border-outline-variant/40 bg-surface-container-low p-3 text-xs leading-5 text-on-surface-variant">
          MVP note: this version stores submissions in your browser for the demo. The next backend step is to post these
          forms to FastAPI and save them to Supabase intake tables.
        </p>

        {submitted && (
          <div className="mb-5 border border-primary/50 bg-primary/10 p-3 text-sm text-primary">
            Submission captured locally for MVP demo.
          </div>
        )}

        {mode === 'vehicle_request' ? <VehicleRequestForm onSubmit={handleSubmit} /> : <CurrentBuildForm onSubmit={handleSubmit} />}
      </Panel>

      <Panel>
        <SectionTitle
          eyebrow="Why this matters"
          title="User input becomes the roadmap"
          subtitle="The next cars, recommendation rules, evidence priorities, and ML training signals should come from real build demand."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <RoadmapCard title="Vehicle onboarding" text="Requested platforms help prioritize what data to scrape, clean, normalize, and validate next." />
          <RoadmapCard title="Baseline builds" text="Current user builds reveal real modification patterns, missing categories, and common goals." />
          <RoadmapCard title="Future ML labels" text="Saved builds, rejected parts, clicked evidence, and target changes can become ranking/evaluation data." />
        </div>
      </Panel>
    </div>
  );
}

function VehicleRequestForm({ onSubmit }: { onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      <FormField name="email" label="Email" type="email" required />
      <FormField name="make" label="Make" placeholder="Nissan" required />
      <FormField name="model" label="Model" placeholder="GT-R" required />
      <FormField name="generation" label="Generation / chassis" placeholder="R35 / BNR34 / A80" />
      <FormField name="year_range" label="Year range" placeholder="2009-2024" />
      <FormField name="engine" label="Engine" placeholder="VR38DETT" />
      <SelectField
        name="use_case"
        label="Primary use case"
        options={['street', 'drag', 'track', 'time_attack', 'drift', 'road_race', 'daily']}
      />
      <TextAreaField name="why" label="Why should this car be onboarded?" placeholder="Tell me what build goals or parts decisions are hard for this platform." />

      <button className="flex items-center justify-center gap-2 bg-primary px-5 py-3 font-headline text-xs font-black uppercase tracking-widest text-white md:col-span-2">
        Submit Vehicle Request <Send className="h-4 w-4" />
      </button>
    </form>
  );
}

function CurrentBuildForm({ onSubmit }: { onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      <FormField name="email" label="Email" type="email" required />
      <FormField name="car" label="Current car" placeholder="2023 Toyota GR Supra 3.0" required />
      <FormField name="engine" label="Engine" placeholder="B58" />
      <FormField name="transmission" label="Transmission" placeholder="ZF8 automatic" />
      <FormField name="current_power" label="Current power estimate" placeholder="430whp" />
      <FormField name="goal_power" label="Goal power" placeholder="575whp" />
      <FormField name="budget" label="Budget" placeholder="$8,000" />
      <SelectField
        name="use_case"
        label="Primary use case"
        options={['street', 'drag', 'track', 'time_attack', 'drift', 'daily']}
      />
      <TextAreaField name="current_mods" label="Current mods" placeholder="Downpipe, intake, tune, tires, cooling, suspension..." />
      <TextAreaField name="pain_point" label="Biggest build planning pain point" placeholder="What is hardest to decide or trust right now?" />

      <label className="flex items-start gap-3 border border-outline-variant/40 bg-surface-container-low p-3 text-sm text-on-surface-variant md:col-span-2">
        <input name="contact_ok" type="checkbox" className="mt-1" />
        <span>It is okay to contact me about future RedlineIQ testing or build validation.</span>
      </label>

      <button className="flex items-center justify-center gap-2 bg-primary px-5 py-3 font-headline text-xs font-black uppercase tracking-widest text-white md:col-span-2">
        Submit Current Build <ClipboardList className="h-4 w-4" />
      </button>
    </form>
  );
}

function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <FieldLabel>{label}</FieldLabel>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full border border-outline-variant/50 bg-surface-container-low px-3 py-3 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}

function SelectField({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <div className="space-y-2">
      <FieldLabel>{label}</FieldLabel>
      <select
        name={name}
        className="w-full border border-outline-variant/50 bg-surface-container-low px-3 py-3 text-sm outline-none focus:border-primary"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option.replace('_', ' ')}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextAreaField({ name, label, placeholder }: { name: string; label: string; placeholder?: string }) {
  return (
    <div className="space-y-2 md:col-span-2">
      <FieldLabel>{label}</FieldLabel>
      <textarea
        name={name}
        rows={4}
        placeholder={placeholder}
        className="w-full border border-outline-variant/50 bg-surface-container-low px-3 py-3 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}

function RoadmapCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="border border-outline-variant/40 bg-surface-container-low p-4">
      <CarFront className="h-5 w-5 text-primary" />
      <p className="mt-3 font-headline text-sm font-black uppercase italic">{title}</p>
      <p className="mt-2 text-xs leading-5 text-on-surface-variant">{text}</p>
    </div>
  );
}
