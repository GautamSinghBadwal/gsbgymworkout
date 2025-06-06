import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkout } from '@/context/WorkoutContext';
import { Exercise, Set, MuscleGroup } from '@/types/workout';
import { format } from 'date-fns';
import { Plus, X, Save, Trash2, Calendar, Play, ExternalLink } from 'lucide-react-native';
import { EXERCISE_TEMPLATES, MUSCLE_GROUP_COLORS } from '@/constants/workoutTemplates';

export default function AddWorkout() {
  const { addWorkout } = useWorkout();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup>('Chest & Triceps');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [notes, setNotes] = useState('');
  const [showMuscleGroupModal, setShowMuscleGroupModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);

  const muscleGroups: MuscleGroup[] = [
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

  const addExercise = (exerciseData: {name: string, videoUrl?: string}) => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exerciseData.name,
      videoUrl: exerciseData.videoUrl,
      sets: [],
    };
    setExercises([...exercises, newExercise]);
    setShowExerciseModal(false);
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter(ex => ex.id !== exerciseId));
  };

  const addSet = (exerciseId: string) => {
    const newSet: Set = {
      id: Date.now().toString(),
      reps: 10,
      weight: 0,
      completed: false,
    };
    
    setExercises(exercises.map(ex => 
      ex.id === exerciseId 
        ? { ...ex, sets: [...ex.sets, newSet] }
        : ex
    ));
  };

  const updateSet = (exerciseId: string, setId: string, field: keyof Set, value: any) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId 
        ? {
            ...ex,
            sets: ex.sets.map(set => 
              set.id === setId ? { ...set, [field]: value } : set
            )
          }
        : ex
    ));
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId 
        ? { ...ex, sets: ex.sets.filter(set => set.id !== setId) }
        : ex
    ));
  };

  const openVideoLink = (url: string) => {
    Linking.openURL(url);
  };

  const saveWorkout = async () => {
    if (exercises.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise');
      return;
    }

    try {
      await addWorkout({
        date: selectedDate,
        muscleGroup: selectedMuscleGroup,
        exercises,
        notes,
      });
      
      // Reset form
      setExercises([]);
      setNotes('');
      Alert.alert('Success', 'Workout saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save workout');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Workout</Text>
        <TouchableOpacity onPress={saveWorkout} style={styles.saveButton}>
          <Save size={20} color="white" />
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date</Text>
          <TouchableOpacity style={styles.dateButton}>
            <Calendar size={16} color="#8B5CF6" />
            <Text style={styles.dateText}>{format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}</Text>
          </TouchableOpacity>
        </View>

        {/* Muscle Group Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Muscle Group</Text>
          <TouchableOpacity 
            style={[
              styles.muscleGroupButton,
              { backgroundColor: MUSCLE_GROUP_COLORS[selectedMuscleGroup] + '30' }
            ]}
            onPress={() => setShowMuscleGroupModal(true)}
          >
            <Text style={styles.muscleGroupText}>{selectedMuscleGroup}</Text>
          </TouchableOpacity>
        </View>

        {/* Exercises */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowExerciseModal(true)}
            >
              <Plus size={16} color="white" />
            </TouchableOpacity>
          </View>

          {exercises.map((exercise) => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseNameContainer}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  {exercise.videoUrl && (
                    <TouchableOpacity 
                      onPress={() => openVideoLink(exercise.videoUrl!)}
                      style={styles.videoButton}
                    >
                      <Play size={14} color="#FF6B6B" />
                      <ExternalLink size={12} color="#FF6B6B" />
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity onPress={() => removeExercise(exercise.id)}>
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>

              {exercise.sets.map((set, setIndex) => (
                <View key={set.id} style={styles.setRow}>
                  <Text style={styles.setNumber}>{setIndex + 1}</Text>
                  
                  <TextInput
                    style={styles.setInput}
                    value={set.reps.toString()}
                    onChangeText={(text) => updateSet(exercise.id, set.id, 'reps', parseInt(text) || 0)}
                    placeholder="Reps"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                  
                  <TextInput
                    style={styles.setInput}
                    value={set.weight.toString()}
                    onChangeText={(text) => updateSet(exercise.id, set.id, 'weight', parseFloat(text) || 0)}
                    placeholder="Weight"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />

                  <TouchableOpacity
                    style={[
                      styles.checkButton,
                      set.completed && styles.checkButtonActive
                    ]}
                    onPress={() => updateSet(exercise.id, set.id, 'completed', !set.completed)}
                  >
                    <Text style={[
                      styles.checkText,
                      set.completed && styles.checkTextActive
                    ]}>
                      ✓
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => removeSet(exercise.id, set.id)}>
                    <Trash2 size={14} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity 
                style={styles.addSetButton}
                onPress={() => addSet(exercise.id)}
              >
                <Plus size={14} color="#8B5CF6" />
                <Text style={styles.addSetText}>Add Set</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add workout notes..."
            placeholderTextColor="#666"
            multiline
          />
        </View>
      </ScrollView>

      {/* Muscle Group Modal */}
      <Modal
        visible={showMuscleGroupModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMuscleGroupModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Muscle Group</Text>
            <ScrollView>
              {muscleGroups.map((group) => (
                <TouchableOpacity
                  key={group}
                  style={[
                    styles.modalOption,
                    selectedMuscleGroup === group && styles.modalOptionSelected
                  ]}
                  onPress={() => {
                    setSelectedMuscleGroup(group);
                    setShowMuscleGroupModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalOptionText,
                    selectedMuscleGroup === group && styles.modalOptionTextSelected
                  ]}>
                    {group}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Exercise Modal */}
      <Modal
        visible={showExerciseModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowExerciseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Exercise</Text>
            <ScrollView>
              {EXERCISE_TEMPLATES[selectedMuscleGroup]?.map((exerciseData) => (
                <TouchableOpacity
                  key={exerciseData.name}
                  style={styles.modalOption}
                  onPress={() => addExercise(exerciseData)}
                >
                  <View style={styles.exerciseOptionContent}>
                    <Text style={styles.modalOptionText}>{exerciseData.name}</Text>
                    {exerciseData.videoUrl && (
                      <Play size={16} color="#FF6B6B" />
                    )}
                  </View>
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
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  muscleGroupButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  muscleGroupText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 6,
    padding: 6,
  },
  exerciseCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  setNumber: {
    width: 20,
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  setInput: {
    flex: 1,
    backgroundColor: '#333',
    color: '#FFFFFF',
    padding: 8,
    borderRadius: 4,
    textAlign: 'center',
  },
  checkButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonActive: {
    backgroundColor: '#10B981',
  },
  checkText: {
    color: '#666',
    fontSize: 12,
  },
  checkTextActive: {
    color: 'white',
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    padding: 8,
    gap: 4,
  },
  addSetText: {
    color: '#8B5CF6',
    fontSize: 14,
  },
  notesInput: {
    backgroundColor: '#1A1A1A',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    minHeight: 80,
    textAlignVertical: 'top',
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
  exerciseOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});