// Preview data for the web screenshot build: a 4-day upper/lower plan run for nine plan weeks,
// with progressive overload, body weight entries and two progress checks.

const USER_ID = '6f1c2a3e-5b7d-4e8f-9a0b-1c2d3e4f5a6b';
const DAY = 86400000;

interface Lift {
  id: string;
  sets: number;
  min: number;
  max: number;
  rir: number;
  /** Weight in week 1 and gain per week (kg). */
  start: number;
  gain: number;
  rest?: number;
  /** Bodyweight moves: reps instead of weight. */
  reps?: [number, number];
}

const ROUTINES: { lifts: Lift[] }[] = [
  {
    lifts: [
      { id: 'bench-press', sets: 3, min: 6, max: 8, rir: 2, start: 77.5, gain: 1.25, rest: 180 },
      { id: 'barbell-row', sets: 3, min: 8, max: 10, rir: 2, start: 65, gain: 1.25, rest: 150 },
      { id: 'overhead-press', sets: 3, min: 6, max: 8, rir: 2, start: 45, gain: 0.625, rest: 150 },
      { id: 'lat-pulldown', sets: 3, min: 10, max: 12, rir: 1, start: 60, gain: 1.25 },
      { id: 'lateral-raise', sets: 3, min: 12, max: 15, rir: 1, start: 10, gain: 0.25, rest: 60 },
      { id: 'triceps-pushdown', sets: 3, min: 10, max: 12, rir: 1, start: 30, gain: 0.6, rest: 60 },
    ],
  },
  {
    lifts: [
      { id: 'squat', sets: 3, min: 5, max: 6, rir: 2, start: 100, gain: 2.5, rest: 180 },
      {
        id: 'romanian-deadlift',
        sets: 3,
        min: 8,
        max: 10,
        rir: 2,
        start: 90,
        gain: 2.5,
        rest: 150,
      },
      { id: 'leg-press', sets: 3, min: 10, max: 12, rir: 1, start: 160, gain: 5 },
      { id: 'lying-leg-curl', sets: 3, min: 10, max: 12, rir: 1, start: 40, gain: 1.25 },
      { id: 'calf-raise', sets: 3, min: 12, max: 15, rir: 1, start: 70, gain: 2.5, rest: 60 },
    ],
  },
  {
    lifts: [
      {
        id: 'incline-dumbbell-press',
        sets: 3,
        min: 8,
        max: 10,
        rir: 2,
        start: 28,
        gain: 0.5,
        rest: 150,
      },
      {
        id: 'pull-up',
        sets: 3,
        min: 6,
        max: 10,
        rir: 2,
        start: 0,
        gain: 0,
        rest: 150,
        reps: [7, 10],
      },
      { id: 'seated-cable-row', sets: 3, min: 10, max: 12, rir: 1, start: 60, gain: 1.25 },
      { id: 'dumbbell-shoulder-press', sets: 3, min: 8, max: 10, rir: 2, start: 22, gain: 0.5 },
      { id: 'face-pull', sets: 3, min: 12, max: 15, rir: 1, start: 22.5, gain: 0.6, rest: 60 },
      { id: 'barbell-curl', sets: 3, min: 8, max: 12, rir: 1, start: 32.5, gain: 0.6, rest: 60 },
    ],
  },
  {
    lifts: [
      { id: 'deadlift', sets: 3, min: 4, max: 6, rir: 2, start: 130, gain: 2.5, rest: 210 },
      {
        id: 'bulgarian-split-squat',
        sets: 3,
        min: 8,
        max: 10,
        rir: 2,
        start: 20,
        gain: 0.6,
        rest: 120,
      },
      { id: 'leg-extension', sets: 3, min: 12, max: 15, rir: 1, start: 50, gain: 1.25, rest: 60 },
      { id: 'seated-leg-curl', sets: 3, min: 10, max: 12, rir: 1, start: 45, gain: 1.25, rest: 60 },
      {
        id: 'hanging-leg-raise',
        sets: 3,
        min: 10,
        max: 15,
        rir: 1,
        start: 0,
        gain: 0,
        rest: 60,
        reps: [10, 14],
      },
    ],
  },
];

/** Plan and routine names as the plan generation writes them, per app language. */
const NAMES: Record<string, { plan: string; routines: string[] }> = {
  en: { plan: 'Upper / Lower 4×', routines: ['Upper A', 'Lower A', 'Upper B', 'Lower B'] },
  de: {
    plan: 'Oberkörper / Unterkörper 4×',
    routines: ['Oberkörper A', 'Unterkörper A', 'Oberkörper B', 'Unterkörper B'],
  },
  'pt-PT': {
    plan: 'Superior / Inferior 4×',
    routines: ['Superior A', 'Inferior A', 'Superior B', 'Inferior B'],
  },
  'pt-BR': {
    plan: 'Superior / Inferior 4×',
    routines: ['Superior A', 'Inferior A', 'Superior B', 'Inferior B'],
  },
  ko: { plan: '상체 / 하체 4×', routines: ['상체 A', '하체 A', '상체 B', '하체 B'] },
};

/** Plate-friendly weights: 2.5 kg steps for barbells and stacks, 1 kg for dumbbells. */
const round = (kg: number, step: number) => Math.round(kg / step) * step;

let seed = 7;
const random = () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const uuid = () => crypto.randomUUID();
const iso = (time: number) => new Date(time).toISOString();
const isoDate = (time: number) => {
  const d = new Date(time);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const atLocal = (dayStart: number, hour: number, minute = 0) =>
  dayStart + (hour * 60 + minute) * 60000;

export async function seedPreview(db: any) {
  // Set by the screenshot script; the app itself picks its language from the browser's.
  const language: string = (globalThis as any).__previewLanguage ?? 'en';
  const names = NAMES[language] ?? NAMES.en;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStart = today.getTime();
  // Monday of the current calendar week.
  const weekday = (today.getDay() + 6) % 7;
  const thisMonday = todayStart - weekday * DAY;

  const planId = uuid();
  const created = thisMonday - 9 * 7 * DAY;
  const statements: [string, unknown[]][] = [];
  const insert = (table: string, row: Record<string, unknown>) => {
    const columns = Object.keys(row);
    statements.push([
      `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
      columns.map((c) => row[c]),
    ]);
  };

  insert('profiles', {
    id: USER_ID,
    user_id: USER_ID,
    first_name: 'Alex',
    sex: 'male',
    birth_date: '1997-03-14',
    unit_preference: 'metric',
    height_cm: 182,
    experience: 'intermediate',
    goal: 'strength_hypertrophy',
    focus: JSON.stringify(['chest', 'side_delts', 'lats']),
    equipment: 'gym',
    home_equipment: '[]',
    session_minutes: 60,
    split: 'upper_lower',
    active_plan_id: planId,
    language,
    avatar_path: null,
    bio: null,
    onboarded_at: iso(created),
    created_at: iso(created),
    updated_at: iso(created),
  });

  for (const [document_id] of [
    ['47d1215e-68db-4b8b-8d50-795394124946'],
    ['e526838f-ebc4-46d6-b1d4-6784895753b2'],
  ]) {
    insert('legal_acceptances', {
      id: uuid(),
      profile_id: USER_ID,
      document_id,
      accepted_at: iso(created),
      app_version: '1.0.0',
      platform: 'ios',
    });
  }

  insert('plans', {
    id: planId,
    user_id: USER_ID,
    name: names.plan,
    position: 0,
    sessions_per_week: 4,
    block_weeks: 6,
    block_start_week: 1,
    created_at: iso(created),
  });

  const routineIds = ROUTINES.map((routine, position) => {
    const id = uuid();
    insert('routines', {
      id,
      user_id: USER_ID,
      plan_id: planId,
      name: names.routines[position],
      position,
      created_at: iso(created),
      updated_at: iso(created),
    });
    routine.lifts.forEach((lift, liftPosition) => {
      const exerciseId = uuid();
      insert('routine_exercises', {
        id: exerciseId,
        user_id: USER_ID,
        routine_id: id,
        exercise_id: lift.id,
        position: liftPosition,
        rest_seconds: lift.rest ?? 90,
      });
      for (let s = 0; s < lift.sets; s++) {
        insert('routine_sets', {
          id: uuid(),
          user_id: USER_ID,
          routine_exercise_id: exerciseId,
          position: s,
          target_min: lift.min,
          target_max: lift.max,
          rir: lift.rir,
        });
      }
    });
    return id;
  });

  // Plan weeks 1–8 fully done (Mon, Tue, Thu, Fri), week 9 with three of four this week.
  const best: Record<string, number> = {};
  const sessions: { week: number; routine: number; day: number }[] = [];
  for (let week = 1; week <= 9; week++) {
    const monday = thisMonday - (9 - week) * 7 * DAY;
    [0, 1, 3, 4].forEach((offset, routine) => {
      if (week === 9 && routine === 3) return;
      sessions.push({ week, routine, day: monday + offset * DAY });
    });
  }
  for (const { week, routine, day } of sessions) {
    if (day > todayStart) continue;
    const { lifts } = ROUTINES[routine];
    const name = names.routines[routine];
    const start = atLocal(day, 18, Math.floor(random() * 40));
    let clock = start + 4 * 60000;
    const workoutId = uuid();
    lifts.forEach((lift, position) => {
      const entryExerciseId = uuid();
      insert('workout_entries_exercises', {
        id: entryExerciseId,
        user_id: USER_ID,
        workout_entries_id: workoutId,
        exercise_id: lift.id,
        position,
        rest_seconds: lift.rest ?? 90,
      });
      // Steady progress, no deload, so the charts read cleanly.
      const deload = false;
      const step = lift.start >= 40 ? 2.5 : lift.start >= 20 ? 1 : 0.5;
      const weight = lift.start
        ? round((lift.start + lift.gain * (week - 1)) * (deload ? 0.85 : 1), step)
        : null;
      for (let s = 0; s < lift.sets; s++) {
        const reps = lift.reps
          ? lift.reps[0] +
            Math.min(lift.reps[1] - lift.reps[0], Math.floor((week - 1) / 2)) -
            (s === 2 ? 1 : 0)
          : Math.max(lift.min, lift.max - (s === 2 ? 1 : 0) - Math.floor(random() * 2));
        const score = (weight ?? 1) * (1 + reps / 30);
        const isPr = !deload && s === 0 && score > (best[lift.id] ?? 0) && week > 1;
        if (s === 0) best[lift.id] = Math.max(best[lift.id] ?? 0, score);
        clock += 45000 + (s ? (lift.rest ?? 90) * 1000 : 60000);
        insert('workout_entries_sets', {
          id: uuid(),
          user_id: USER_ID,
          workout_entries_exercise_id: entryExerciseId,
          position: s,
          target_min: lift.min,
          target_max: lift.max,
          target_rir: deload ? lift.rir + 2 : lift.rir,
          weight_kg: weight,
          reps,
          seconds: null,
          completed_at: iso(clock),
          is_pr: isPr ? 1 : 0,
        });
      }
    });
    insert('workout_entries', {
      id: workoutId,
      user_id: USER_ID,
      routine_id: routineIds[routine],
      plan_id: planId,
      plan_week: week,
      name,
      started_at: iso(start),
      finished_at: iso(clock + 90000),
      created_at: iso(start),
    });
  }

  // Body weight: most mornings, from 83.6 kg trending to about 80.9 kg, with daily noise.
  const firstDay = thisMonday - 9 * 7 * DAY;
  for (let day = firstDay, i = 0; day <= todayStart; day += DAY, i++) {
    if (random() < 0.22 && day !== todayStart) continue;
    const trend = 83.6 - (2.7 * i) / ((todayStart - firstDay) / DAY);
    const kg = Math.round((trend + (random() - 0.5) * 0.9) * 10) / 10;
    insert('weight_entries', {
      id: uuid(),
      user_id: USER_ID,
      date: isoDate(day),
      weight_kg: kg,
      created_at: iso(atLocal(day, 7, 30)),
    });
  }

  // Two progress checks, eight weeks apart.
  const checks = [
    {
      at: firstDay + 2 * DAY,
      score: 64,
      groups: { shoulders: 61, chest: 66, arms: 58, back: 67, core: 63, legs: 70 },
      metrics: { bodyFat: 18.5, proportions: 66, definition: 57 },
    },
    {
      at: todayStart - 1 * DAY,
      score: 73,
      groups: { shoulders: 71, chest: 75, arms: 68, back: 76, core: 70, legs: 77 },
      metrics: { bodyFat: 15.9, proportions: 72, definition: 68 },
    },
  ];
  for (const [index, check] of checks.entries()) {
    const checkId = `00000000-0000-4000-8000-0000000000c${index + 1}`;
    insert('progress_checks', {
      id: checkId,
      user_id: USER_ID,
      score: check.score,
      group_scores: JSON.stringify(check.groups),
      metrics: JSON.stringify(check.metrics),
      created_at: iso(atLocal(check.at, 8, 10)),
    });
    for (const pose of ['front', 'side', 'back']) {
      insert('progress_check_photos', {
        id: uuid(),
        user_id: USER_ID,
        check_id: checkId,
        pose,
        storage_path: `${USER_ID}/${checkId}/${pose}.jpg`,
        created_at: iso(atLocal(check.at, 8, 10)),
      });
    }
  }

  await db.writeTransaction(async (tx: any) => {
    for (const [sql, params] of statements) await tx.execute(sql, params);
  });
  console.log(`[preview] seeded ${statements.length} rows`);
}
