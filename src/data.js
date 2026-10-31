// ===== Exercise library =====
// Format: Name|Category|Muscle|Equipment|Type
// Types: wr = weight x reps, bw = reps (+optional added weight), as = assisted (-weight) x reps,
//        ts = hold time in seconds, tm = duration in minutes, dt = distance + minutes, wt = weight + seconds
const EX_RAW = `
Bench Press (Barbell)|Strength|Chest|Barbell|wr
Incline Bench Press (Barbell)|Strength|Chest|Barbell|wr
Decline Bench Press (Barbell)|Strength|Chest|Barbell|wr
Bench Press (Dumbbell)|Strength|Chest|Dumbbell|wr
Incline Bench Press (Dumbbell)|Strength|Chest|Dumbbell|wr
Decline Bench Press (Dumbbell)|Strength|Chest|Dumbbell|wr
Chest Fly (Dumbbell)|Strength|Chest|Dumbbell|wr
Incline Chest Fly (Dumbbell)|Strength|Chest|Dumbbell|wr
Cable Crossover|Strength|Chest|Cable|wr
Low-to-High Cable Fly|Strength|Chest|Cable|wr
Pec Deck|Strength|Chest|Machine|wr
Chest Press (Machine)|Strength|Chest|Machine|wr
Incline Chest Press (Machine)|Strength|Chest|Machine|wr
Bench Press (Smith Machine)|Strength|Chest|Smith machine|wr
Floor Press (Dumbbell)|Strength|Chest|Dumbbell|wr
Pullover (Dumbbell)|Strength|Chest|Dumbbell|wr
Deadlift (Barbell)|Strength|Back|Barbell|wr
Trap Bar Deadlift|Strength|Back|Other|wr
Rack Pull|Strength|Back|Barbell|wr
Bent Over Row (Barbell)|Strength|Back|Barbell|wr
Pendlay Row|Strength|Back|Barbell|wr
One-Arm Row (Dumbbell)|Strength|Back|Dumbbell|wr
Chest-Supported Row (Dumbbell)|Strength|Back|Dumbbell|wr
T-Bar Row|Strength|Back|Barbell|wr
Seated Cable Row|Strength|Back|Cable|wr
Lat Pulldown (Wide Grip)|Strength|Back|Cable|wr
Lat Pulldown (Close Grip)|Strength|Back|Cable|wr
Single-Arm Lat Pulldown|Strength|Back|Cable|wr
Straight-Arm Pulldown|Strength|Back|Cable|wr
Row (Machine)|Strength|Back|Machine|wr
Meadows Row|Strength|Back|Barbell|wr
Seal Row|Strength|Back|Barbell|wr
Back Extension|Strength|Back|Machine|bw
Shrug (Barbell)|Strength|Back|Barbell|wr
Shrug (Dumbbell)|Strength|Back|Dumbbell|wr
Overhead Press (Barbell)|Strength|Shoulders|Barbell|wr
Seated Shoulder Press (Dumbbell)|Strength|Shoulders|Dumbbell|wr
Arnold Press|Strength|Shoulders|Dumbbell|wr
Shoulder Press (Machine)|Strength|Shoulders|Machine|wr
Push Press|Strength|Shoulders|Barbell|wr
Landmine Press|Strength|Shoulders|Barbell|wr
Lateral Raise (Dumbbell)|Strength|Shoulders|Dumbbell|wr
Lateral Raise (Cable)|Strength|Shoulders|Cable|wr
Lateral Raise (Machine)|Strength|Shoulders|Machine|wr
Front Raise (Dumbbell)|Strength|Shoulders|Dumbbell|wr
Rear Delt Fly (Dumbbell)|Strength|Shoulders|Dumbbell|wr
Reverse Pec Deck|Strength|Shoulders|Machine|wr
Face Pull|Strength|Shoulders|Cable|wr
Upright Row (Barbell)|Strength|Shoulders|Barbell|wr
Barbell Curl|Strength|Biceps|Barbell|wr
EZ-Bar Curl|Strength|Biceps|EZ bar|wr
Dumbbell Curl|Strength|Biceps|Dumbbell|wr
Hammer Curl|Strength|Biceps|Dumbbell|wr
Incline Dumbbell Curl|Strength|Biceps|Dumbbell|wr
Preacher Curl (EZ Bar)|Strength|Biceps|EZ bar|wr
Preacher Curl (Machine)|Strength|Biceps|Machine|wr
Cable Curl|Strength|Biceps|Cable|wr
Bayesian Cable Curl|Strength|Biceps|Cable|wr
Concentration Curl|Strength|Biceps|Dumbbell|wr
Spider Curl|Strength|Biceps|Dumbbell|wr
Triceps Pushdown (Rope)|Strength|Triceps|Cable|wr
Triceps Pushdown (Bar)|Strength|Triceps|Cable|wr
Overhead Triceps Extension (Cable)|Strength|Triceps|Cable|wr
Overhead Triceps Extension (Dumbbell)|Strength|Triceps|Dumbbell|wr
Skull Crusher (EZ Bar)|Strength|Triceps|EZ bar|wr
Close-Grip Bench Press|Strength|Triceps|Barbell|wr
Triceps Kickback (Dumbbell)|Strength|Triceps|Dumbbell|wr
Dip (Machine)|Strength|Triceps|Machine|wr
JM Press|Strength|Triceps|Barbell|wr
Wrist Curl (Dumbbell)|Strength|Forearms|Dumbbell|wr
Reverse Wrist Curl|Strength|Forearms|Dumbbell|wr
Reverse Curl (Barbell)|Strength|Forearms|Barbell|wr
Farmer's Walk|Strength|Forearms|Dumbbell|wt
Plate Pinch|Strength|Forearms|Other|wt
Back Squat (Barbell)|Strength|Quads|Barbell|wr
Front Squat (Barbell)|Strength|Quads|Barbell|wr
Goblet Squat|Strength|Quads|Dumbbell|wr
Leg Press|Strength|Quads|Machine|wr
Hack Squat|Strength|Quads|Machine|wr
Leg Extension|Strength|Quads|Machine|wr
Squat (Smith Machine)|Strength|Quads|Smith machine|wr
Belt Squat|Strength|Quads|Machine|wr
Bulgarian Split Squat (Dumbbell)|Strength|Quads|Dumbbell|wr
Walking Lunge (Dumbbell)|Strength|Quads|Dumbbell|wr
Reverse Lunge (Dumbbell)|Strength|Quads|Dumbbell|wr
Step-Up (Dumbbell)|Strength|Quads|Dumbbell|wr
Romanian Deadlift (Barbell)|Strength|Hamstrings|Barbell|wr
Romanian Deadlift (Dumbbell)|Strength|Hamstrings|Dumbbell|wr
Stiff-Leg Deadlift|Strength|Hamstrings|Barbell|wr
Good Morning|Strength|Hamstrings|Barbell|wr
Lying Leg Curl|Strength|Hamstrings|Machine|wr
Seated Leg Curl|Strength|Hamstrings|Machine|wr
Glute-Ham Raise|Strength|Hamstrings|Machine|bw
Hip Thrust (Barbell)|Strength|Glutes|Barbell|wr
Hip Thrust (Machine)|Strength|Glutes|Machine|wr
Glute Bridge (Barbell)|Strength|Glutes|Barbell|wr
Cable Kickback|Strength|Glutes|Cable|wr
Hip Abduction (Machine)|Strength|Glutes|Machine|wr
Hip Adduction (Machine)|Strength|Glutes|Machine|wr
Sumo Deadlift|Strength|Glutes|Barbell|wr
Standing Calf Raise (Machine)|Strength|Calves|Machine|wr
Seated Calf Raise|Strength|Calves|Machine|wr
Calf Press (Leg Press)|Strength|Calves|Machine|wr
Single-Leg Calf Raise (Dumbbell)|Strength|Calves|Dumbbell|wr
Cable Crunch|Strength|Core|Cable|wr
Ab Wheel Rollout|Strength|Core|Other|bw
Decline Sit-Up|Strength|Core|Bodyweight|bw
Russian Twist|Strength|Core|Bodyweight|bw
Pallof Press|Strength|Core|Cable|wr
Cable Woodchopper|Strength|Core|Cable|wr
Ab Crunch (Machine)|Strength|Core|Machine|wr
Kettlebell Swing|Strength|Full body|Kettlebell|wr
Kettlebell Goblet Squat|Strength|Quads|Kettlebell|wr
Turkish Get-Up|Strength|Full body|Kettlebell|wr
Kettlebell Clean & Press|Strength|Full body|Kettlebell|wr
Power Clean|Strength|Full body|Barbell|wr
Clean & Jerk|Strength|Full body|Barbell|wr
Snatch|Strength|Full body|Barbell|wr
Thruster (Barbell)|Strength|Full body|Barbell|wr
Medicine Ball Slam|Strength|Full body|Other|wr
Sled Push|Strength|Full body|Other|wt
Push-Up|Calisthenics|Chest|Bodyweight|bw
Wide Push-Up|Calisthenics|Chest|Bodyweight|bw
Diamond Push-Up|Calisthenics|Triceps|Bodyweight|bw
Decline Push-Up|Calisthenics|Chest|Bodyweight|bw
Incline Push-Up|Calisthenics|Chest|Bodyweight|bw
Knee Push-Up|Calisthenics|Chest|Bodyweight|bw
Archer Push-Up|Calisthenics|Chest|Bodyweight|bw
Pike Push-Up|Calisthenics|Shoulders|Bodyweight|bw
Handstand Push-Up|Calisthenics|Shoulders|Bodyweight|bw
Pseudo Planche Push-Up|Calisthenics|Chest|Bodyweight|bw
One-Arm Push-Up|Calisthenics|Chest|Bodyweight|bw
Pull-Up|Calisthenics|Back|Bodyweight|bw
Chin-Up|Calisthenics|Back|Bodyweight|bw
Wide-Grip Pull-Up|Calisthenics|Back|Bodyweight|bw
Assisted Pull-Up|Calisthenics|Back|Machine|as
Band-Assisted Pull-Up|Calisthenics|Back|Band|bw
Negative Pull-Up|Calisthenics|Back|Bodyweight|bw
Australian Row (Inverted Row)|Calisthenics|Back|Bodyweight|bw
Muscle-Up|Calisthenics|Full body|Bodyweight|bw
Dip (Parallel Bars)|Calisthenics|Triceps|Bodyweight|bw
Assisted Dip|Calisthenics|Triceps|Machine|as
Bench Dip|Calisthenics|Triceps|Bodyweight|bw
Bodyweight Squat|Calisthenics|Quads|Bodyweight|bw
Pistol Squat|Calisthenics|Quads|Bodyweight|bw
Shrimp Squat|Calisthenics|Quads|Bodyweight|bw
Sissy Squat|Calisthenics|Quads|Bodyweight|bw
Lunge (Bodyweight)|Calisthenics|Quads|Bodyweight|bw
Bulgarian Split Squat (Bodyweight)|Calisthenics|Quads|Bodyweight|bw
Wall Sit|Calisthenics|Quads|Bodyweight|ts
Nordic Hamstring Curl|Calisthenics|Hamstrings|Bodyweight|bw
Glute Bridge (Bodyweight)|Calisthenics|Glutes|Bodyweight|bw
Single-Leg Glute Bridge|Calisthenics|Glutes|Bodyweight|bw
Calf Raise (Bodyweight)|Calisthenics|Calves|Bodyweight|bw
Plank|Calisthenics|Core|Bodyweight|ts
Side Plank|Calisthenics|Core|Bodyweight|ts
Hollow Body Hold|Calisthenics|Core|Bodyweight|ts
L-Sit|Calisthenics|Core|Bodyweight|ts
Hanging Leg Raise|Calisthenics|Core|Bodyweight|bw
Hanging Knee Raise|Calisthenics|Core|Bodyweight|bw
Toes-to-Bar|Calisthenics|Core|Bodyweight|bw
Lying Leg Raise|Calisthenics|Core|Bodyweight|bw
Crunch|Calisthenics|Core|Bodyweight|bw
Sit-Up|Calisthenics|Core|Bodyweight|bw
Bicycle Crunch|Calisthenics|Core|Bodyweight|bw
V-Up|Calisthenics|Core|Bodyweight|bw
Dragon Flag|Calisthenics|Core|Bodyweight|bw
Superman Hold|Calisthenics|Back|Bodyweight|ts
Dead Hang|Calisthenics|Forearms|Bodyweight|ts
Front Lever Hold|Calisthenics|Back|Bodyweight|ts
Back Lever Hold|Calisthenics|Back|Bodyweight|ts
Handstand Hold|Calisthenics|Shoulders|Bodyweight|ts
Planche Lean|Calisthenics|Shoulders|Bodyweight|ts
Skin the Cat|Calisthenics|Back|Bodyweight|bw
Running (Outdoor)|Cardio|Cardio|None|dt
Treadmill Run|Cardio|Cardio|Machine|dt
Trail Running|Cardio|Cardio|None|dt
Walking|Cardio|Cardio|None|dt
Incline Treadmill Walk|Cardio|Cardio|Machine|dt
Hiking|Cardio|Cardio|None|dt
Cycling (Outdoor)|Cardio|Cardio|Other|dt
Stationary Bike|Cardio|Cardio|Machine|dt
Spin Class|Cardio|Cardio|Machine|tm
Air Bike|Cardio|Cardio|Machine|dt
Rowing Machine|Cardio|Cardio|Machine|dt
Ski Erg|Cardio|Cardio|Machine|dt
Elliptical|Cardio|Cardio|Machine|dt
Stair Climber|Cardio|Cardio|Machine|tm
Swimming|Cardio|Cardio|None|dt
Jump Rope|Cardio|Cardio|Other|tm
Sprints|Cardio|Cardio|None|dt
Dance / Zumba|Cardio|Cardio|None|tm
Aerobics|Cardio|Cardio|None|tm
Burpee|HIIT & Plyo|Full body|Bodyweight|bw
Jumping Jacks|HIIT & Plyo|Full body|Bodyweight|bw
Mountain Climbers|HIIT & Plyo|Core|Bodyweight|ts
High Knees|HIIT & Plyo|Cardio|Bodyweight|ts
Box Jump|HIIT & Plyo|Quads|Other|bw
Broad Jump|HIIT & Plyo|Quads|Bodyweight|bw
Jump Squat|HIIT & Plyo|Quads|Bodyweight|bw
Jump Lunge|HIIT & Plyo|Quads|Bodyweight|bw
Tuck Jump|HIIT & Plyo|Quads|Bodyweight|bw
Skater Jumps|HIIT & Plyo|Glutes|Bodyweight|bw
Clap Push-Up|HIIT & Plyo|Chest|Bodyweight|bw
Battle Ropes|HIIT & Plyo|Full body|Other|ts
Bear Crawl|HIIT & Plyo|Full body|Bodyweight|ts
Shuttle Run|HIIT & Plyo|Cardio|None|ts
Sprint Intervals|HIIT & Plyo|Cardio|None|tm
Tabata|HIIT & Plyo|Full body|None|tm
HIIT Circuit|HIIT & Plyo|Full body|None|tm
CrossFit WOD|HIIT & Plyo|Full body|Other|tm
Yoga Session|Mobility & Yoga|Mobility|None|tm
Surya Namaskar (Sun Salutation)|Mobility & Yoga|Mobility|None|bw
Pranayama / Breathwork|Mobility & Yoga|Mobility|None|tm
Pilates|Mobility & Yoga|Core|None|tm
Full-Body Stretching|Mobility & Yoga|Mobility|None|tm
Foam Rolling|Mobility & Yoga|Mobility|Other|tm
Hip Flexor Stretch|Mobility & Yoga|Mobility|None|ts
Hamstring Stretch|Mobility & Yoga|Mobility|None|ts
Pigeon Pose|Mobility & Yoga|Mobility|None|ts
Downward Dog|Mobility & Yoga|Mobility|None|ts
Child's Pose|Mobility & Yoga|Mobility|None|ts
Cobra Stretch|Mobility & Yoga|Mobility|None|ts
Cat-Cow|Mobility & Yoga|Mobility|None|bw
World's Greatest Stretch|Mobility & Yoga|Mobility|None|bw
Deep Squat Hold|Mobility & Yoga|Mobility|None|ts
Shoulder Dislocates (Band)|Mobility & Yoga|Mobility|Band|bw
Thoracic Rotation|Mobility & Yoga|Mobility|None|bw
Band Pull-Apart|Mobility & Yoga|Shoulders|Band|bw
Football|Sports|Sports|None|tm
Cricket|Sports|Sports|None|tm
Badminton|Sports|Sports|None|tm
Tennis|Sports|Sports|None|tm
Table Tennis|Sports|Sports|None|tm
Basketball|Sports|Sports|None|tm
Volleyball|Sports|Sports|None|tm
Squash|Sports|Sports|None|tm
Pickleball|Sports|Sports|None|tm
Kabaddi|Sports|Sports|None|tm
Boxing|Sports|Sports|Other|tm
Martial Arts|Sports|Sports|None|tm
Climbing / Bouldering|Sports|Sports|Other|tm
Skating|Sports|Sports|Other|tm
`;

const CATS = ['Strength', 'Calisthenics', 'Cardio', 'HIIT & Plyo', 'Mobility & Yoga', 'Sports'];
const MUSCLES = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Forearms', 'Quads', 'Hamstrings', 'Glutes', 'Calves', 'Core', 'Full body', 'Cardio', 'Mobility', 'Sports'];
const EQUIP = ['Barbell', 'Dumbbell', 'Machine', 'Cable', 'Kettlebell', 'EZ bar', 'Smith machine', 'Band', 'Bodyweight', 'Other', 'None'];
const TYPES = {
  wr: 'Weight × reps',
  bw: 'Reps (bodyweight, + optional weight)',
  as: 'Assisted (− weight) × reps',
  ts: 'Hold time (seconds)',
  tm: 'Duration (minutes)',
  dt: 'Distance + duration',
  wt: 'Weight + time (seconds)'
};
// Body-part groups used for "days since trained"
const GROUPS = {
  Chest: ['Chest'], Back: ['Back'], Shoulders: ['Shoulders'],
  Arms: ['Biceps', 'Triceps', 'Forearms'],
  Legs: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
  Core: ['Core'], Cardio: ['Cardio', 'Sports'], 'Full body': ['Full body']
};

const slug = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const LIBRARY = EX_RAW.trim().split('\n').map(line => {
  const [name, cat, muscle, equip, type] = line.split('|');
  return { id: slug(name), name, cat, muscle, equip, type };
});

// ===== Ready-made programs =====
// Each exercise: [name, sets, target]; target = reps ("8-12" ok) for wr/bw/as, seconds for ts/wt, minutes for tm, km for dt
const PROGRAMS = [
  {
    name: 'Push / Pull / Legs', level: 'Intermediate · 3–6 days/week',
    desc: 'Classic bodybuilding split. Run it Push → Pull → Legs and repeat.',
    routines: [
      { name: 'Push', ex: [['Bench Press (Barbell)', 4, '6-8'], ['Seated Shoulder Press (Dumbbell)', 3, '8-10'], ['Incline Bench Press (Dumbbell)', 3, '8-12'], ['Lateral Raise (Dumbbell)', 3, '12-15'], ['Triceps Pushdown (Rope)', 3, '10-12'], ['Overhead Triceps Extension (Cable)', 3, '10-12']] },
      { name: 'Pull', ex: [['Deadlift (Barbell)', 3, '5'], ['Pull-Up', 3, '6-10'], ['Bent Over Row (Barbell)', 3, '8-10'], ['Seated Cable Row', 3, '10-12'], ['Face Pull', 3, '12-15'], ['Barbell Curl', 3, '8-12'], ['Hammer Curl', 3, '10-12']] },
      { name: 'Legs', ex: [['Back Squat (Barbell)', 4, '6-8'], ['Romanian Deadlift (Barbell)', 3, '8-10'], ['Leg Press', 3, '10-12'], ['Lying Leg Curl', 3, '10-12'], ['Leg Extension', 3, '12-15'], ['Standing Calf Raise (Machine)', 4, '10-15'], ['Plank', 3, 60]] }
    ]
  },
  {
    name: 'Upper / Lower', level: 'Beginner–Intermediate · 4 days/week',
    desc: 'Upper A, Lower A, Upper B, Lower B. Great balance of strength and size.',
    routines: [
      { name: 'Upper A', ex: [['Bench Press (Barbell)', 4, '5-8'], ['Bent Over Row (Barbell)', 4, '6-8'], ['Overhead Press (Barbell)', 3, '8-10'], ['Lat Pulldown (Wide Grip)', 3, '8-12'], ['EZ-Bar Curl', 2, '10-12'], ['Triceps Pushdown (Bar)', 2, '10-12']] },
      { name: 'Lower A', ex: [['Back Squat (Barbell)', 4, '5-8'], ['Romanian Deadlift (Barbell)', 3, '8-10'], ['Walking Lunge (Dumbbell)', 3, '10-12'], ['Seated Leg Curl', 3, '10-12'], ['Standing Calf Raise (Machine)', 3, '12-15'], ['Hanging Leg Raise', 3, '10-15']] },
      { name: 'Upper B', ex: [['Incline Bench Press (Dumbbell)', 4, '8-10'], ['Pull-Up', 4, '6-10'], ['Seated Shoulder Press (Dumbbell)', 3, '8-12'], ['Seated Cable Row', 3, '10-12'], ['Lateral Raise (Dumbbell)', 3, '12-15'], ['Hammer Curl', 2, '10-12']] },
      { name: 'Lower B', ex: [['Deadlift (Barbell)', 3, '4-6'], ['Leg Press', 3, '10-12'], ['Bulgarian Split Squat (Dumbbell)', 3, '8-10'], ['Hip Thrust (Barbell)', 3, '8-12'], ['Leg Extension', 3, '12-15'], ['Cable Crunch', 3, '12-15']] }
    ]
  },
  {
    name: 'Full Body Beginner', level: 'Beginner · 3 days/week',
    desc: 'Alternate A and B on non-consecutive days (e.g. Mon/Wed/Fri).',
    routines: [
      { name: 'Full Body A', ex: [['Back Squat (Barbell)', 3, '5-8'], ['Bench Press (Barbell)', 3, '5-8'], ['Bent Over Row (Barbell)', 3, '8-10'], ['Lateral Raise (Dumbbell)', 2, '12-15'], ['Plank', 3, 45]] },
      { name: 'Full Body B', ex: [['Deadlift (Barbell)', 3, '5'], ['Overhead Press (Barbell)', 3, '6-8'], ['Lat Pulldown (Wide Grip)', 3, '8-12'], ['Goblet Squat', 2, '10-12'], ['Dumbbell Curl', 2, '10-12']] }
    ]
  },
  {
    name: 'Calisthenics Foundations', level: 'Beginner · 3 days/week · no gym',
    desc: 'Bodyweight only. Build to strict pull-ups, dips and pistols.',
    routines: [
      { name: 'Calisthenics Push & Legs', ex: [['Push-Up', 4, '8-15'], ['Pike Push-Up', 3, '6-10'], ['Dip (Parallel Bars)', 3, '6-10'], ['Bodyweight Squat', 3, '15-25'], ['Bulgarian Split Squat (Bodyweight)', 3, '10-12'], ['Plank', 3, 60]] },
      { name: 'Calisthenics Pull & Core', ex: [['Pull-Up', 4, '5-8'], ['Australian Row (Inverted Row)', 3, '10-15'], ['Chin-Up', 3, '5-8'], ['Hanging Knee Raise', 3, '10-15'], ['Hollow Body Hold', 3, 30], ['Dead Hang', 2, 45]] }
    ]
  },
  {
    name: 'Cardio & Conditioning', level: 'All levels · 2–3 days/week',
    desc: 'Mix steady cardio with a short HIIT finisher.',
    routines: [
      { name: 'Steady Cardio', ex: [['Treadmill Run', 1, 5], ['Stationary Bike', 1, 10], ['Full-Body Stretching', 1, 10]] },
      { name: 'HIIT Finisher', ex: [['Jump Rope', 3, 3], ['Burpee', 4, 12], ['Mountain Climbers', 4, 30], ['Jump Squat', 3, 15], ['Battle Ropes', 3, 30]] }
    ]
  },
  {
    name: 'Mobility & Recovery', level: 'All levels · rest days',
    desc: 'Loosen hips, hamstrings and shoulders on off days.',
    routines: [
      { name: 'Mobility Flow', ex: [['Surya Namaskar (Sun Salutation)', 1, '6'], ['Cat-Cow', 2, '10'], ['World\'s Greatest Stretch', 2, '6'], ['Hip Flexor Stretch', 2, 45], ['Pigeon Pose', 2, 45], ['Hamstring Stretch', 2, 45], ['Shoulder Dislocates (Band)', 2, '12'], ['Deep Squat Hold', 2, 60]] }
    ]
  }
];
