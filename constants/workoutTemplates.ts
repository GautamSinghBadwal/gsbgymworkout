import { WorkoutTemplate, MuscleGroup } from '@/types/workout';

export const WORKOUT_SCHEDULE: Record<string, MuscleGroup> = {
  'monday': 'Chest & Triceps',
  'tuesday': 'Back & Biceps',
  'wednesday': 'Legs & Shoulders',
  'thursday': 'Chest & Triceps',
  'friday': 'Back & Biceps',
  'saturday': 'Legs & Shoulders',
  'sunday': 'Full Body',
};

export const EXERCISE_TEMPLATES: Record<MuscleGroup, Array<{name: string, videoUrl?: string}>> = {
  'Chest & Triceps': [
    { name: 'Bench Press', videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg' },
    { name: 'Incline Dumbbell Press', videoUrl: 'https://www.youtube.com/watch?v=8iPEnn-ltC8' },
    { name: 'Decline Barbell Press', videoUrl: 'https://www.youtube.com/watch?v=LfyQBUKR8SE' },
    { name: 'Chest Flyes', videoUrl: 'https://www.youtube.com/watch?v=eozdVDA78K0' },
    { name: 'Push-ups', videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
    { name: 'Tricep Dips', videoUrl: 'https://www.youtube.com/watch?v=6kALZikXxLc' },
    { name: 'Close-Grip Bench Press', videoUrl: 'https://www.youtube.com/watch?v=nEF0bv2FW94' },
    { name: 'Tricep Extensions', videoUrl: 'https://www.youtube.com/watch?v=nRiJVZDpdL0' },
    { name: 'Overhead Tricep Press', videoUrl: 'https://www.youtube.com/watch?v=YbX7Wd8jQ-Q' },
    { name: 'Diamond Push-ups', videoUrl: 'https://www.youtube.com/watch?v=J0DnG1_S92I' },
  ],
  'Back & Biceps': [
    { name: 'Pull-ups', videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g' },
    { name: 'Lat Pulldowns', videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc' },
    { name: 'Barbell Rows', videoUrl: 'https://www.youtube.com/watch?v=FWJR5Ve8bnQ' },
    { name: 'Dumbbell Rows', videoUrl: 'https://www.youtube.com/watch?v=roCP6wCXPqo' },
    { name: 'T-Bar Rows', videoUrl: 'https://www.youtube.com/watch?v=j3Igk5nyZE4' },
    { name: 'Cable Rows', videoUrl: 'https://www.youtube.com/watch?v=xQNrFHEMhI4' },
    { name: 'Barbell Curls', videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo' },
    { name: 'Dumbbell Curls', videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo' },
    { name: 'Hammer Curls', videoUrl: 'https://www.youtube.com/watch?v=zC3nLlEvin4' },
    { name: 'Preacher Curls', videoUrl: 'https://www.youtube.com/watch?v=fIWP-FRFNU0' },
  ],
  'Legs & Shoulders': [
    { name: 'Squats', videoUrl: 'https://www.youtube.com/watch?v=Dy28eq2PjcM' },
    { name: 'Deadlifts', videoUrl: 'https://www.youtube.com/watch?v=ytGaGIn3SjE' },
    { name: 'Leg Press', videoUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ' },
    { name: 'Lunges', videoUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U' },
    { name: 'Calf Raises', videoUrl: 'https://www.youtube.com/watch?v=gwLzBJYoWlI' },
    { name: 'Leg Curls', videoUrl: 'https://www.youtube.com/watch?v=ELOCsoDSmrg' },
    { name: 'Leg Extensions', videoUrl: 'https://www.youtube.com/watch?v=YyvSfVjQeL0' },
    { name: 'Shoulder Press', videoUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog' },
    { name: 'Lateral Raises', videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo' },
    { name: 'Front Raises', videoUrl: 'https://www.youtube.com/watch?v=qzaKUHI4Kv8' },
    { name: 'Rear Delt Flyes', videoUrl: 'https://www.youtube.com/watch?v=EA7u4Q_8HQ0' },
    { name: 'Shrugs', videoUrl: 'https://www.youtube.com/watch?v=cJRVVxmytaM' },
  ],
  'Push': [
    { name: 'Bench Press', videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg' },
    { name: 'Incline Press', videoUrl: 'https://www.youtube.com/watch?v=8iPEnn-ltC8' },
    { name: 'Shoulder Press', videoUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog' },
    { name: 'Tricep Dips', videoUrl: 'https://www.youtube.com/watch?v=6kALZikXxLc' },
    { name: 'Lateral Raises', videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo' },
    { name: 'Push-ups', videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
  ],
  'Pull': [
    { name: 'Pull-ups', videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g' },
    { name: 'Rows', videoUrl: 'https://www.youtube.com/watch?v=FWJR5Ve8bnQ' },
    { name: 'Lat Pulldowns', videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc' },
    { name: 'Barbell Curls', videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo' },
    { name: 'Face Pulls', videoUrl: 'https://www.youtube.com/watch?v=rep-qVOkqgk' },
    { name: 'Shrugs', videoUrl: 'https://www.youtube.com/watch?v=cJRVVxmytaM' },
  ],
  'Legs': [
    { name: 'Squats', videoUrl: 'https://www.youtube.com/watch?v=Dy28eq2PjcM' },
    { name: 'Deadlifts', videoUrl: 'https://www.youtube.com/watch?v=ytGaGIn3SjE' },
    { name: 'Leg Press', videoUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ' },
    { name: 'Lunges', videoUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U' },
    { name: 'Calf Raises', videoUrl: 'https://www.youtube.com/watch?v=gwLzBJYoWlI' },
    { name: 'Leg Curls', videoUrl: 'https://www.youtube.com/watch?v=ELOCsoDSmrg' },
  ],
  'Upper': [
    { name: 'Bench Press', videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg' },
    { name: 'Pull-ups', videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g' },
    { name: 'Shoulder Press', videoUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog' },
    { name: 'Rows', videoUrl: 'https://www.youtube.com/watch?v=FWJR5Ve8bnQ' },
    { name: 'Curls', videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo' },
    { name: 'Tricep Extensions', videoUrl: 'https://www.youtube.com/watch?v=nRiJVZDpdL0' },
  ],
  'Lower': [
    { name: 'Squats', videoUrl: 'https://www.youtube.com/watch?v=Dy28eq2PjcM' },
    { name: 'Deadlifts', videoUrl: 'https://www.youtube.com/watch?v=ytGaGIn3SjE' },
    { name: 'Lunges', videoUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U' },
    { name: 'Calf Raises', videoUrl: 'https://www.youtube.com/watch?v=gwLzBJYoWlI' },
    { name: 'Leg Press', videoUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ' },
    { name: 'Glute Bridges', videoUrl: 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E' },
  ],
  'Full Body': [
    { name: 'Burpees', videoUrl: 'https://www.youtube.com/watch?v=TU8QYVW0gDU' },
    { name: 'Deadlifts', videoUrl: 'https://www.youtube.com/watch?v=ytGaGIn3SjE' },
    { name: 'Squats', videoUrl: 'https://www.youtube.com/watch?v=Dy28eq2PjcM' },
    { name: 'Push-ups', videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
    { name: 'Pull-ups', videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g' },
    { name: 'Plank', videoUrl: 'https://www.youtube.com/watch?v=ASdvN_XEl_c' },
  ],
};

export const MUSCLE_GROUP_COLORS: Record<MuscleGroup, string> = {
  'Chest & Triceps': '#FF6B6B',
  'Back & Biceps': '#4ECDC4',
  'Legs & Shoulders': '#45B7D1',
  'Push': '#96CEB4',
  'Pull': '#FFEAA7',
  'Legs': '#DDA0DD',
  'Upper': '#98D8C8',
  'Lower': '#F7DC6F',
  'Full Body': '#BB8FCE',
};

export const FOOD_SUGGESTIONS = [
  {
    name: 'Grilled Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    imageUrl: 'https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    name: 'Brown Rice',
    calories: 112,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    imageUrl: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    name: 'Salmon Fillet',
    calories: 208,
    protein: 22,
    carbs: 0,
    fat: 12,
    imageUrl: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    name: 'Greek Yogurt',
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0.4,
    imageUrl: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    name: 'Avocado',
    calories: 160,
    protein: 2,
    carbs: 9,
    fat: 15,
    imageUrl: 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    name: 'Sweet Potato',
    calories: 112,
    protein: 2,
    carbs: 26,
    fat: 0.1,
    imageUrl: 'https://images.pexels.com/photos/89247/pexels-photo-89247.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    name: 'Quinoa',
    calories: 222,
    protein: 8,
    carbs: 39,
    fat: 3.6,
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    name: 'Eggs',
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    imageUrl: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
];