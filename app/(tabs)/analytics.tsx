import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useWorkout } from '@/context/WorkoutContext';
import { format, parseISO, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { TrendingUp, ChartBar as BarChart3, Calendar, Target, Award, Activity } from 'lucide-react-native';
import { MuscleGroup } from '@/types/workout';
import { MUSCLE_GROUP_COLORS } from '@/constants/workoutTemplates';

const { width } = Dimensions.get('window');
const chartWidth = width - 40;

export default function Analytics() {
  const { workouts, getWorkoutStats } = useWorkout();
  const [selectedChart, setSelectedChart] = useState<'volume' | 'frequency'>('volume');
  const stats = getWorkoutStats();

  const chartConfig = {
    backgroundColor: '#1A1A1A',
    backgroundGradientFrom: '#1A1A1A',
    backgroundGradientTo: '#1A1A1A',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#8B5CF6',
    },
  };

  // Prepare volume over time data (last 30 days)
  const getVolumeOverTimeData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => 
      format(subDays(new Date(), 29 - i), 'yyyy-MM-dd')
    );

    const volumeData = last30Days.map(date => {
      const dayWorkouts = workouts.filter(w => w.date === date);
      return dayWorkouts.reduce((total, workout) => {
        return total + workout.exercises.reduce((exerciseTotal, exercise) => {
          return exerciseTotal + exercise.sets.reduce((setTotal, set) => {
            return setTotal + (set.completed ? set.reps * set.weight : 0);
          }, 0);
        }, 0);
      }, 0);
    });

    return {
      labels: last30Days.map((_, i) => i % 5 === 0 ? format(subDays(new Date(), 29 - i), 'M/d') : ''),
      datasets: [
        {
          data: volumeData,
          color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  };

  // Prepare muscle group frequency data
  const getMuscleGroupData = () => {
    const muscleGroupCounts: Record<string, number> = {};
    
    workouts.forEach(workout => {
      muscleGroupCounts[workout.muscleGroup] = (muscleGroupCounts[workout.muscleGroup] || 0) + 1;
    });

    const sortedGroups = Object.entries(muscleGroupCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6);

    return {
      labels: sortedGroups.map(([group]) => group.split(' ')[0]),
      datasets: [
        {
          data: sortedGroups.map(([,count]) => count),
          colors: sortedGroups.map(([group]) => () => MUSCLE_GROUP_COLORS[group as MuscleGroup] || '#8B5CF6'),
        },
      ],
    };
  };

  // Weekly consistency data
  const getWeeklyConsistencyData = () => {
    const currentWeek = eachDayOfInterval({
      start: startOfWeek(new Date()),
      end: endOfWeek(new Date()),
    });

    return currentWeek.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const hasWorkout = workouts.some(w => w.date === dateStr);
      return {
        date: format(date, 'EEE'),
        completed: hasWorkout,
      };
    });
  };

  const volumeData = getVolumeOverTimeData();
  const muscleGroupData = getMuscleGroupData();
  const weeklyData = getWeeklyConsistencyData();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Key Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#8B5CF6" />
            <Text style={styles.statNumber}>{stats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Total Workouts</Text>
          </View>
          
          <View style={styles.statCard}>
            <Target size={24} color="#10B981" />
            <Text style={styles.statNumber}>{stats.currentStreak}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          
          <View style={styles.statCard}>
            <Award size={24} color="#F59E0B" />
            <Text style={styles.statNumber}>{stats.longestStreak}</Text>
            <Text style={styles.statLabel}>Longest Streak</Text>
          </View>
          
          <View style={styles.statCard}>
            <Activity size={24} color="#EF4444" />
            <Text style={styles.statNumber}>{Math.round(stats.totalVolume / 1000)}k</Text>
            <Text style={styles.statLabel}>Total Volume</Text>
          </View>
        </View>

        {/* Chart Selection */}
        <View style={styles.chartSelector}>
          <TouchableOpacity 
            style={[
              styles.chartTab,
              selectedChart === 'volume' && styles.chartTabActive
            ]}
            onPress={() => setSelectedChart('volume')}
          >
            <TrendingUp size={16} color={selectedChart === 'volume' ? 'white' : '#888'} />
            <Text style={[
              styles.chartTabText,
              selectedChart === 'volume' && styles.chartTabTextActive
            ]}>
              Volume Trend
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.chartTab,
              selectedChart === 'frequency' && styles.chartTabActive
            ]}
            onPress={() => setSelectedChart('frequency')}
          >
            <BarChart3 size={16} color={selectedChart === 'frequency' ? 'white' : '#888'} />
            <Text style={[
              styles.chartTabText,
              selectedChart === 'frequency' && styles.chartTabTextActive
            ]}>
              Muscle Groups
            </Text>
          </TouchableOpacity>
        </View>

        {/* Charts */}
        <View style={styles.chartContainer}>
          {selectedChart === 'volume' ? (
            <View style={styles.chart}>
              <Text style={styles.chartTitle}>Volume Over Time (Last 30 Days)</Text>
              {volumeData.datasets[0].data.some(value => value > 0) ? (
                <LineChart
                  data={volumeData}
                  width={chartWidth}
                  height={200}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chartStyle}
                />
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No volume data available</Text>
                  <Text style={styles.noDataSubtext}>Start tracking workouts to see trends</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.chart}>
              <Text style={styles.chartTitle}>Workouts by Muscle Group</Text>
              {muscleGroupData.datasets[0].data.length > 0 ? (
                <BarChart
                  data={muscleGroupData}
                  width={chartWidth}
                  height={200}
                  chartConfig={chartConfig}
                  style={styles.chartStyle}
                  yAxisSuffix=""
                  showBarTops={false}
                />
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No workout data available</Text>
                  <Text style={styles.noDataSubtext}>Complete some workouts to see distribution</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Weekly Consistency */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>This Week's Consistency</Text>
          </View>
          <View style={styles.weeklyGrid}>
            {weeklyData.map((day, index) => (
              <View key={index} style={styles.dayItem}>
                <View style={[
                  styles.dayCircle,
                  day.completed && styles.dayCircleCompleted
                ]}>
                  <Text style={[
                    styles.dayText,
                    day.completed && styles.dayTextCompleted
                  ]}>
                    {day.date[0]}
                  </Text>
                </View>
                <Text style={styles.dayLabel}>{day.date}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Muscle Group Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Muscle Group Breakdown</Text>
          {Object.entries(stats.muscleGroupStats)
            .sort(([,a], [,b]) => b.workouts - a.workouts)
            .slice(0, 5)
            .map(([muscleGroup, data]) => (
              <View key={muscleGroup} style={styles.muscleGroupItem}>
                <View style={styles.muscleGroupInfo}>
                  <View style={[
                    styles.muscleGroupColor,
                    { backgroundColor: MUSCLE_GROUP_COLORS[muscleGroup as MuscleGroup] }
                  ]} />
                  <Text style={styles.muscleGroupName}>{muscleGroup}</Text>
                </View>
                <View style={styles.muscleGroupStats}>
                  <Text style={styles.muscleGroupCount}>{data.workouts} workouts</Text>
                  <Text style={styles.muscleGroupVolume}>{Math.round(data.volume)} kg</Text>
                </View>
              </View>
            ))}
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
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  chartSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  chartTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#1A1A1A',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  chartTabActive: {
    backgroundColor: '#8B5CF6',
  },
  chartTabText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  chartTabTextActive: {
    color: 'white',
  },
  chartContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  chart: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  chartStyle: {
    borderRadius: 16,
  },
  noDataContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  noDataSubtext: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  weeklyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  dayItem: {
    alignItems: 'center',
    gap: 8,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleCompleted: {
    backgroundColor: '#10B981',
  },
  dayText: {
    color: '#888',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dayTextCompleted: {
    color: 'white',
  },
  dayLabel: {
    color: '#888',
    fontSize: 12,
  },
  muscleGroupItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  muscleGroupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  muscleGroupColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  muscleGroupName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  muscleGroupStats: {
    alignItems: 'flex-end',
  },
  muscleGroupCount: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  muscleGroupVolume: {
    color: '#888',
    fontSize: 12,
  },
});