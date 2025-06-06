import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout, Exercise, Set, MuscleGroup, WorkoutStats, FoodEntry, DailyNutrition, NutritionStats } from '@/types/workout';
import { format, parseISO, differenceInDays, startOfWeek, endOfWeek } from 'date-fns';

interface WorkoutContextType {
  workouts: Workout[];
  foodEntries: FoodEntry[];
  addWorkout: (workout: Omit<Workout, 'id'>) => Promise<void>;
  updateWorkout: (id: string, workout: Partial<Workout>) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  addFoodEntry: (food: Omit<FoodEntry, 'id'>) => Promise<void>;
  updateFoodEntry: (id: string, food: Partial<FoodEntry>) => Promise<void>;
  deleteFoodEntry: (id: string) => Promise<void>;
  getWorkoutsByDate: (date: string) => Workout[];
  getWorkoutsByMuscleGroup: (muscleGroup: MuscleGroup) => Workout[];
  getFoodEntriesByDate: (date: string) => FoodEntry[];
  getDailyNutrition: (date: string) => DailyNutrition;
  getWorkoutStats: () => WorkoutStats;
  getNutritionStats: () => NutritionStats;
  isLoading: boolean;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const WORKOUTS_STORAGE_KEY = 'gym_workouts';
const FOOD_STORAGE_KEY = 'food_entries';

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storedWorkouts, storedFood] = await Promise.all([
        AsyncStorage.getItem(WORKOUTS_STORAGE_KEY),
        AsyncStorage.getItem(FOOD_STORAGE_KEY)
      ]);
      
      if (storedWorkouts) {
        setWorkouts(JSON.parse(storedWorkouts));
      }
      if (storedFood) {
        setFoodEntries(JSON.parse(storedFood));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveWorkouts = async (updatedWorkouts: Workout[]) => {
    try {
      await AsyncStorage.setItem(WORKOUTS_STORAGE_KEY, JSON.stringify(updatedWorkouts));
      setWorkouts(updatedWorkouts);
    } catch (error) {
      console.error('Error saving workouts:', error);
    }
  };

  const saveFoodEntries = async (updatedFood: FoodEntry[]) => {
    try {
      await AsyncStorage.setItem(FOOD_STORAGE_KEY, JSON.stringify(updatedFood));
      setFoodEntries(updatedFood);
    } catch (error) {
      console.error('Error saving food entries:', error);
    }
  };

  const addWorkout = async (workoutData: Omit<Workout, 'id'>) => {
    const newWorkout: Workout = {
      ...workoutData,
      id: Date.now().toString(),
    };
    const updatedWorkouts = [...workouts, newWorkout];
    await saveWorkouts(updatedWorkouts);
  };

  const updateWorkout = async (id: string, workoutData: Partial<Workout>) => {
    const updatedWorkouts = workouts.map(workout =>
      workout.id === id ? { ...workout, ...workoutData } : workout
    );
    await saveWorkouts(updatedWorkouts);
  };

  const deleteWorkout = async (id: string) => {
    const updatedWorkouts = workouts.filter(workout => workout.id !== id);
    await saveWorkouts(updatedWorkouts);
  };

  const addFoodEntry = async (foodData: Omit<FoodEntry, 'id'>) => {
    const newFood: FoodEntry = {
      ...foodData,
      id: Date.now().toString(),
    };
    const updatedFood = [...foodEntries, newFood];
    await saveFoodEntries(updatedFood);
  };

  const updateFoodEntry = async (id: string, foodData: Partial<FoodEntry>) => {
    const updatedFood = foodEntries.map(food =>
      food.id === id ? { ...food, ...foodData } : food
    );
    await saveFoodEntries(updatedFood);
  };

  const deleteFoodEntry = async (id: string) => {
    const updatedFood = foodEntries.filter(food => food.id !== id);
    await saveFoodEntries(updatedFood);
  };

  const getWorkoutsByDate = (date: string) => {
    return workouts.filter(workout => workout.date === date);
  };

  const getWorkoutsByMuscleGroup = (muscleGroup: MuscleGroup) => {
    return workouts.filter(workout => workout.muscleGroup === muscleGroup);
  };

  const getFoodEntriesByDate = (date: string) => {
    return foodEntries.filter(food => food.date === date);
  };

  const getDailyNutrition = (date: string): DailyNutrition => {
    const dayFood = getFoodEntriesByDate(date);
    
    return {
      date,
      totalCalories: dayFood.reduce((sum, food) => sum + food.calories, 0),
      totalProtein: dayFood.reduce((sum, food) => sum + food.protein, 0),
      totalCarbs: dayFood.reduce((sum, food) => sum + food.carbs, 0),
      totalFat: dayFood.reduce((sum, food) => sum + food.fat, 0),
      meals: dayFood,
    };
  };

  const getWorkoutStats = (): WorkoutStats => {
    const totalWorkouts = workouts.length;
    
    let totalVolume = 0;
    const muscleGroupStats: Record<string, any> = {};
    
    workouts.forEach(workout => {
      let workoutVolume = 0;
      workout.exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          if (set.completed) {
            workoutVolume += set.reps * set.weight;
          }
        });
      });
      
      totalVolume += workoutVolume;
      
      if (!muscleGroupStats[workout.muscleGroup]) {
        muscleGroupStats[workout.muscleGroup] = {
          workouts: 0,
          volume: 0,
          lastWorkout: workout.date,
        };
      }
      
      muscleGroupStats[workout.muscleGroup].workouts += 1;
      muscleGroupStats[workout.muscleGroup].volume += workoutVolume;
      
      if (workout.date > muscleGroupStats[workout.muscleGroup].lastWorkout) {
        muscleGroupStats[workout.muscleGroup].lastWorkout = workout.date;
      }
    });

    // Calculate streaks
    const sortedDates = workouts
      .map(w => w.date)
      .sort()
      .filter((date, index, arr) => arr.indexOf(date) === index);
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = format(new Date(), 'yyyy-MM-dd');
    
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const date = sortedDates[i];
      const daysDiff = differenceInDays(parseISO(today), parseISO(date));
      
      if (i === sortedDates.length - 1) {
        if (daysDiff <= 1) {
          currentStreak = 1;
          tempStreak = 1;
        }
      } else {
        const prevDate = sortedDates[i + 1];
        const daysBetween = differenceInDays(parseISO(prevDate), parseISO(date));
        
        if (daysBetween <= 2) {
          tempStreak += 1;
          if (i === sortedDates.length - 1 || daysDiff <= 1) {
            currentStreak = tempStreak;
          }
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    return {
      totalWorkouts,
      totalVolume,
      averageVolume: totalWorkouts > 0 ? totalVolume / totalWorkouts : 0,
      currentStreak,
      longestStreak,
      muscleGroupStats,
    };
  };

  const getNutritionStats = (): NutritionStats => {
    const totalEntries = foodEntries.length;
    
    if (totalEntries === 0) {
      return {
        averageCalories: 0,
        averageProtein: 0,
        averageCarbs: 0,
        averageFat: 0,
        totalMeals: 0,
      };
    }

    return {
      averageCalories: foodEntries.reduce((sum, food) => sum + food.calories, 0) / totalEntries,
      averageProtein: foodEntries.reduce((sum, food) => sum + food.protein, 0) / totalEntries,
      averageCarbs: foodEntries.reduce((sum, food) => sum + food.carbs, 0) / totalEntries,
      averageFat: foodEntries.reduce((sum, food) => sum + food.fat, 0) / totalEntries,
      totalMeals: totalEntries,
    };
  };

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        foodEntries,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        addFoodEntry,
        updateFoodEntry,
        deleteFoodEntry,
        getWorkoutsByDate,
        getWorkoutsByMuscleGroup,
        getFoodEntriesByDate,
        getDailyNutrition,
        getWorkoutStats,
        getNutritionStats,
        isLoading,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}