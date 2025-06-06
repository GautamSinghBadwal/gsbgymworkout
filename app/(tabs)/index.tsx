import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useWorkout } from '@/context/WorkoutContext';
import { format } from 'date-fns';
import { Calendar, TrendingUp, Target, Award, Dumbbell, UtensilsCrossed, Apple } from 'lucide-react-native';
import { WORKOUT_SCHEDULE, MUSCLE_GROUP_COLORS, FOOD_SUGGESTIONS } from '@/constants/workoutTemplates';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const { workouts, getWorkoutStats, getDailyNutrition, isLoading } = useWorkout();
  const stats = getWorkoutStats();
  const today = format(new Date(), 'yyyy-MM-dd');
  const todaysWorkouts = workouts.filter(w => w.date === today);
  const todaysNutrition = getDailyNutrition(today);

  const getWeeklySchedule = () => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return days.map((day, index) => ({
      day: dayNames[index],
      muscleGroup: WORKOUT_SCHEDULE[day],
      completed: todaysWorkouts.some(w => w.muscleGroup === WORKOUT_SCHEDULE[day]),
    }));
  };

  const recentWorkouts = workouts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const todaysFoodSuggestion = FOOD_SUGGESTIONS[Math.floor(Math.random() * FOOD_SUGGESTIONS.length)];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, GSB! 💦</Text>
          <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM d')}</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <TrendingUp size={24} color="white" />
            <Text style={styles.statNumber}>{stats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Total Workouts</Text>
          </LinearGradient>

          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Target size={24} color="white" />
            <Text style={styles.statNumber}>{stats.currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </LinearGradient>

          <LinearGradient
            colors={['#F59E0B', '#D97706']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Award size={24} color="white" />
            <Text style={styles.statNumber}>{Math.round(stats.totalVolume / 1000)}k</Text>
            <Text style={styles.statLabel}>Total Volume</Text>
          </LinearGradient>
        </View>

        {/* Today's Nutrition Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <UtensilsCrossed size={20} color="#10B981" />
            <Text style={styles.sectionTitle}>Today's Khana</Text>
          </View>
          <View style={styles.nutritionCard}>
            <View style={styles.nutritionSummary}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionNumber}>{Math.round(todaysNutrition.totalCalories)}</Text>
                <Text style={styles.nutritionLabel}>Calories</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionNumber}>{Math.round(todaysNutrition.totalProtein)}g</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionNumber}>{Math.round(todaysNutrition.totalCarbs)}g</Text>
                <Text style={styles.nutritionLabel}>Carbs</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionNumber}>{Math.round(todaysNutrition.totalFat)}g</Text>
                <Text style={styles.nutritionLabel}>Fat</Text>
              </View>
            </View>
            
            {/* Food Suggestion */}
            <View style={styles.foodSuggestion}>
              <View style={styles.suggestionHeader}>
                <Apple size={16} color="#10B981" />
                <Text style={styles.suggestionTitle}>Today's Food Suggestion</Text>
              </View>
              <View style={styles.suggestionContent}>
                <Image source={{ uri: todaysFoodSuggestion.imageUrl }} style={styles.suggestionImage} />
                <View style={styles.suggestionInfo}>
                  <Text style={styles.suggestionName}>{todaysFoodSuggestion.name}</Text>
                  <Text style={styles.suggestionMacros}>
                    {todaysFoodSuggestion.calories} cal • {todaysFoodSuggestion.protein}g protein
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Weekly Schedule */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Weekly Bakchodi</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scheduleScroll}>
            {getWeeklySchedule().map((item, index) => (
              <View
                key={index}
                style={[
                  styles.scheduleCard,
                  { backgroundColor: MUSCLE_GROUP_COLORS[item.muscleGroup] + '20' }
                ]}
              >
                <Text style={styles.scheduleDay}>{item.day}</Text>
                <Text style={styles.scheduleMuscle}>{item.muscleGroup}</Text>
                {item.completed && (
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedText}>✓</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Recent Workouts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Dumbbell size={20} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Recent Workout Bakchodi</Text>
          </View>
          {recentWorkouts.length > 0 ? (
            recentWorkouts.map((workout) => (
              <View key={workout.id} style={styles.workoutCard}>
                <View style={styles.workoutHeader}>
                  <Text style={styles.workoutMuscleGroup}>{workout.muscleGroup}</Text>
                  <Text style={styles.workoutDate}>{format(new Date(workout.date), 'MMM d')}</Text>
                </View>
                <Text style={styles.workoutExercises}>
                  {workout.exercises.map(e => e.name).join(' • ')}
                </Text>
                <View style={styles.workoutStats}>
                  <Text style={styles.workoutVolume}>
                    {Math.round(
                      workout.exercises.reduce((total, exercise) => 
                        total + exercise.sets.reduce((setTotal, set) => 
                          setTotal + (set.completed ? set.reps * set.weight : 0), 0
                        ), 0
                      )
                    )} kg total
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No workouts yet</Text>
              <Text style={styles.emptySubtext}>Stop your fitness journey today! Start Your Bakchodi Today</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: '#888',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  nutritionCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
  },
  nutritionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#888',
  },
  foodSuggestion: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 16,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  suggestionImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  suggestionMacros: {
    fontSize: 12,
    color: '#888',
  },
  scheduleScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  scheduleCard: {
    width: 120,
    padding: 15,
    borderRadius: 12,
    marginRight: 12,
    position: 'relative',
  },
  scheduleDay: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  scheduleMuscle: {
    fontSize: 12,
    color: '#CCCCCC',
    lineHeight: 16,
  },
  completedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#10B981',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  workoutCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutMuscleGroup: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  workoutDate: {
    fontSize: 14,
    color: '#888',
  },
  workoutExercises: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 8,
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  workoutVolume: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});