export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  videoUrl?: string; // YouTube video URL for exercise demonstration
}

export interface Set {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface Workout {
  id: string;
  date: string;
  muscleGroup: MuscleGroup;
  exercises: Exercise[];
  duration?: number;
  notes?: string;
}

export interface FoodEntry {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
  notes?: string;
}

export interface DailyNutrition {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: FoodEntry[];
}

export type MuscleGroup = 
  | 'Chest & Triceps'
  | 'Back & Biceps' 
  | 'Legs & Shoulders'
  | 'Push'
  | 'Pull'
  | 'Legs'
  | 'Upper'
  | 'Lower'
  | 'Full Body';

export interface WorkoutTemplate {
  muscleGroup: MuscleGroup;
  exercises: string[];
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalVolume: number;
  averageVolume: number;
  currentStreak: number;
  longestStreak: number;
  muscleGroupStats: Record<MuscleGroup, {
    workouts: number;
    volume: number;
    lastWorkout?: string;
  }>;
}

export interface NutritionStats {
  averageCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
  totalMeals: number;
}