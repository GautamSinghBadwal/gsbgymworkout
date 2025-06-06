import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkout } from '@/context/WorkoutContext';
import { MuscleGroup } from '@/types/workout';
import { format, parseISO } from 'date-fns';
import { Filter, Calendar, Dumbbell, TrendingUp, Play, ExternalLink } from 'lucide-react-native';
import { MUSCLE_GROUP_COLORS } from '@/constants/workoutTemplates';

export default function History() {
  const { workouts } = useWorkout();
  const [filterMuscleGroup, setFilterMuscleGroup] = useState<MuscleGroup | 'All'>('All');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const muscleGroups: (MuscleGroup | 'All')[] = [
    'All',
    'Chest & Triceps',
    'Back & Biceps',
    'Legs & Shoulders',
    'Push',
    'Pull',
    'Legs',
    'Upper',
    'Lower',
    'Full Body',
  ];

  const filteredWorkouts = workouts
    .filter(workout => filterMuscleGroup === 'All' || workout.muscleGroup === filterMuscleGroup)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getWorkoutVolume = (workout: any) => {
    return workout.exercises.reduce((total: number, exercise: any) => 
      total + exercise.sets.reduce((setTotal: number, set: any) => 
        setTotal + (set.completed ? set.reps * set.weight : 0), 0
      ), 0
    );
  };

  const openVideoLink = (url: string) => {
    Linking.openURL(url);
  };

  const renderWorkoutItem = ({ item: workout }: { item: any }) => (
    <View style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <View style={styles.workoutInfo}>
          <Text style={styles.workoutMuscleGroup}>{workout.muscleGroup}</Text>
          <Text style={styles.workoutDate}>{format(parseISO(workout.date), 'EEEE, MMM d, yyyy')}</Text>
        </View>
        <View 
          style={[
            styles.muscleGroupBadge,
            { backgroundColor: MUSCLE_GROUP_COLORS[workout.muscleGroup] + '30' }
          ]}
        >
          <View 
            style={[
              styles.muscleGroupDot,
              { backgroundColor: MUSCLE_GROUP_COLORS[workout.muscleGroup] }
            ]}
          />
        </View>
      </View>

      <View style={styles.workoutStats}>
        <View style={styles.statItem}>
          <Dumbbell size={16} color="#8B5CF6" />
          <Text style={styles.statText}>{workout.exercises.length} exercises</Text>
        </View>
        <View style={styles.statItem}>
          <TrendingUp size={16} color="#10B981" />
          <Text style={styles.statText}>{Math.round(getWorkoutVolume(workout))} kg total</Text>
        </View>
      </View>

      <View style={styles.exercisesList}>
        {workout.exercises.map((exercise: any, index: number) => (
          <View key={exercise.id} style={styles.exerciseItem}>
            <View style={styles.exerciseNameContainer}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              {exercise.videoUrl && (
                <TouchableOpacity 
                  onPress={() => openVideoLink(exercise.videoUrl)}
                  style={styles.videoLinkButton}
                >
                  <Play size={12} color="#FF6B6B" />
                  <ExternalLink size={10} color="#FF6B6B" />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.exerciseSets}>
              {exercise.sets.filter((set: any) => set.completed).length} sets
            </Text>
          </View>
        ))}
      </View>

      {workout.notes && (
        <View style={styles.notesSection}>
          <Text style={styles.notesText}>{workout.notes}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workout History</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Filter size={20} color="white" />
        </TouchableOpacity>
      </View>

      {filterMuscleGroup !== 'All' && (
        <View style={styles.filterInfo}>
          <Text style={styles.filterText}>
            Showing: {filterMuscleGroup} ({filteredWorkouts.length} workouts)
          </Text>
          <TouchableOpacity onPress={() => setFilterMuscleGroup('All')}>
            <Text style={styles.clearFilter}>Clear Filter</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.statsBar}>
        <View style={styles.statContainer}>
          <Text style={styles.statNumber}>{filteredWorkouts.length}</Text>
          <Text style={styles.statLabel}>Total Workouts</Text>
        </View>
        <View style={styles.statContainer}>
          <Text style={styles.statNumber}>
            {Math.round(
              filteredWorkouts.reduce((total, workout) => total + getWorkoutVolume(workout), 0) / 1000
            )}k
          </Text>
          <Text style={styles.statLabel}>Total Volume</Text>
        </View>
        <View style={styles.statContainer}>
          <Text style={styles.statNumber}>
            {filteredWorkouts.length > 0 
              ? Math.round(
                  filteredWorkouts.reduce((total, workout) => total + getWorkoutVolume(workout), 0) / filteredWorkouts.length
                )
              : 0
            }
          </Text>
          <Text style={styles.statLabel}>Avg Volume</Text>
        </View>
      </View>

      {filteredWorkouts.length > 0 ? (
        <FlatList
          data={filteredWorkouts}
          renderItem={renderWorkoutItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Calendar size={48} color="#666" />
          <Text style={styles.emptyText}>No workouts found</Text>
          <Text style={styles.emptySubtext}>
            {filterMuscleGroup === 'All' 
              ? 'Start tracking your workouts!' 
              : `No ${filterMuscleGroup} workouts yet`
            }
          </Text>
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Muscle Group</Text>
            <ScrollView>
              {muscleGroups.map((group) => (
                <TouchableOpacity
                  key={group}
                  style={[
                    styles.modalOption,
                    filterMuscleGroup === group && styles.modalOptionSelected
                  ]}
                  onPress={() => {
                    setFilterMuscleGroup(group);
                    setShowFilterModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalOptionText,
                    filterMuscleGroup === group && styles.modalOptionTextSelected
                  ]}>
                    {group}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  filterButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    padding: 8,
  },
  filterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1A1A1A',
  },
  filterText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  clearFilter: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  statsBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  statContainer: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  listContainer: {
    padding: 20,
  },
  workoutCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutMuscleGroup: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  workoutDate: {
    fontSize: 14,
    color: '#888',
  },
  muscleGroupBadge: {
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muscleGroupDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: '#CCCCCC',
    fontSize: 12,
  },
  exercisesList: {
    gap: 8,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  exerciseName: {
    color: '#FFFFFF',
    fontSize: 14,
    flex: 1,
  },
  videoLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  exerciseSets: {
    color: '#888',
    fontSize: 12,
  },
  notesSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  notesText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalOptionSelected: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    marginBottom: 4,
  },
  modalOptionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalOptionTextSelected: {
    fontWeight: 'bold',
  },
});