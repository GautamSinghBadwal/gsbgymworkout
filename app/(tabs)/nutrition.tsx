import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkout } from '@/context/WorkoutContext';
import { FoodEntry } from '@/types/workout';
import { format } from 'date-fns';
import { Plus, Calendar, Utensils, Trash2, CreditCard as Edit3, Camera } from 'lucide-react-native';
import { FOOD_SUGGESTIONS } from '@/constants/workoutTemplates';

export default function Nutrition() {
  const { addFoodEntry, getFoodEntriesByDate, getDailyNutrition, deleteFoodEntry } = useWorkout();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  
  // Form state
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const dailyNutrition = getDailyNutrition(selectedDate);
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

  const resetForm = () => {
    setFoodName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setNotes('');
    setImageUrl('');
  };

  const handleAddFood = async () => {
    if (!foodName || !calories) {
      Alert.alert('Error', 'Please enter food name and calories');
      return;
    }

    try {
      await addFoodEntry({
        date: selectedDate,
        mealType: selectedMealType,
        name: foodName,
        calories: parseFloat(calories) || 0,
        protein: parseFloat(protein) || 0,
        carbs: parseFloat(carbs) || 0,
        fat: parseFloat(fat) || 0,
        imageUrl: imageUrl || undefined,
        notes: notes || undefined,
      });

      resetForm();
      setShowAddModal(false);
      Alert.alert('Success', 'Food entry added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add food entry');
    }
  };

  const handleSelectSuggestion = (suggestion: typeof FOOD_SUGGESTIONS[0]) => {
    setFoodName(suggestion.name);
    setCalories(suggestion.calories.toString());
    setProtein(suggestion.protein.toString());
    setCarbs(suggestion.carbs.toString());
    setFat(suggestion.fat.toString());
    setImageUrl(suggestion.imageUrl);
    setShowSuggestionsModal(false);
  };

  const handleDeleteFood = async (foodId: string) => {
    Alert.alert(
      'Delete Food Entry',
      'Are you sure you want to delete this food entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteFoodEntry(foodId)
        }
      ]
    );
  };

  const getMealsByType = (mealType: string) => {
    return dailyNutrition.meals.filter(meal => meal.mealType === mealType);
  };

  const getMealCalories = (mealType: string) => {
    return getMealsByType(mealType).reduce((sum, meal) => sum + meal.calories, 0);
  };

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '#F59E0B';
      case 'lunch': return '#10B981';
      case 'dinner': return '#8B5CF6';
      case 'snack': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nutrition Tracker</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Date Selection */}
      <View style={styles.dateSection}>
        <TouchableOpacity style={styles.dateButton}>
          <Calendar size={16} color="#8B5CF6" />
          <Text style={styles.dateText}>{format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}</Text>
        </TouchableOpacity>
      </View>

      {/* Daily Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Today's Nutrition</Text>
        <View style={styles.macroGrid}>
          <View style={styles.macroItem}>
            <Text style={styles.macroNumber}>{Math.round(dailyNutrition.totalCalories)}</Text>
            <Text style={styles.macroLabel}>Calories</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroNumber}>{Math.round(dailyNutrition.totalProtein)}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroNumber}>{Math.round(dailyNutrition.totalCarbs)}g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroNumber}>{Math.round(dailyNutrition.totalFat)}g</Text>
            <Text style={styles.macroLabel}>Fat</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Meals by Type */}
        {mealTypes.map((mealType) => (
          <View key={mealType} style={styles.mealSection}>
            <View style={styles.mealHeader}>
              <View style={styles.mealTitleContainer}>
                <Text style={styles.mealIcon}>{getMealTypeIcon(mealType)}</Text>
                <Text style={styles.mealTitle}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</Text>
                <View style={[styles.mealBadge, { backgroundColor: getMealTypeColor(mealType) + '30' }]}>
                  <Text style={[styles.mealCalories, { color: getMealTypeColor(mealType) }]}>
                    {getMealCalories(mealType)} cal
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[styles.addMealButton, { backgroundColor: getMealTypeColor(mealType) }]}
                onPress={() => {
                  setSelectedMealType(mealType);
                  setShowAddModal(true);
                }}
              >
                <Plus size={16} color="white" />
              </TouchableOpacity>
            </View>

            {getMealsByType(mealType).map((food) => (
              <View key={food.id} style={styles.foodCard}>
                <View style={styles.foodContent}>
                  {food.imageUrl && (
                    <Image source={{ uri: food.imageUrl }} style={styles.foodImage} />
                  )}
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <View style={styles.foodMacros}>
                      <Text style={styles.foodMacro}>{food.calories} cal</Text>
                      <Text style={styles.foodMacro}>P: {food.protein}g</Text>
                      <Text style={styles.foodMacro}>C: {food.carbs}g</Text>
                      <Text style={styles.foodMacro}>F: {food.fat}g</Text>
                    </View>
                    {food.notes && (
                      <Text style={styles.foodNotes}>{food.notes}</Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteFood(food.id)}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}

            {getMealsByType(mealType).length === 0 && (
              <View style={styles.emptyMeal}>
                <Text style={styles.emptyMealText}>No {mealType} entries yet</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Add Food Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Food Entry</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              {/* Meal Type Selection */}
              <View style={styles.mealTypeSelector}>
                {mealTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.mealTypeButton,
                      selectedMealType === type && styles.mealTypeButtonActive,
                      { borderColor: getMealTypeColor(type) }
                    ]}
                    onPress={() => setSelectedMealType(type)}
                  >
                    <Text style={styles.mealTypeIcon}>{getMealTypeIcon(type)}</Text>
                    <Text style={[
                      styles.mealTypeText,
                      selectedMealType === type && styles.mealTypeTextActive
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Quick Suggestions Button */}
              <TouchableOpacity 
                style={styles.suggestionsButton}
                onPress={() => setShowSuggestionsModal(true)}
              >
                <Utensils size={16} color="#8B5CF6" />
                <Text style={styles.suggestionsButtonText}>Choose from suggestions</Text>
              </TouchableOpacity>

              {/* Form Fields */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Food Name *</Text>
                <TextInput
                  style={styles.formInput}
                  value={foodName}
                  onChangeText={setFoodName}
                  placeholder="Enter food name"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.formRow}>
                <View style={styles.formGroupHalf}>
                  <Text style={styles.formLabel}>Calories *</Text>
                  <TextInput
                    style={styles.formInput}
                    value={calories}
                    onChangeText={setCalories}
                    placeholder="0"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.formGroupHalf}>
                  <Text style={styles.formLabel}>Protein (g)</Text>
                  <TextInput
                    style={styles.formInput}
                    value={protein}
                    onChangeText={setProtein}
                    placeholder="0"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formGroupHalf}>
                  <Text style={styles.formLabel}>Carbs (g)</Text>
                  <TextInput
                    style={styles.formInput}
                    value={carbs}
                    onChangeText={setCarbs}
                    placeholder="0"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.formGroupHalf}>
                  <Text style={styles.formLabel}>Fat (g)</Text>
                  <TextInput
                    style={styles.formInput}
                    value={fat}
                    onChangeText={setFat}
                    placeholder="0"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Image URL</Text>
                <TextInput
                  style={styles.formInput}
                  value={imageUrl}
                  onChangeText={setImageUrl}
                  placeholder="https://example.com/image.jpg"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Notes</Text>
                <TextInput
                  style={[styles.formInput, styles.notesInput]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add notes..."
                  placeholderTextColor="#666"
                  multiline
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleAddFood}>
                <Text style={styles.saveButtonText}>Add Food Entry</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Food Suggestions Modal */}
      <Modal
        visible={showSuggestionsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSuggestionsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Food Suggestions</Text>
              <TouchableOpacity onPress={() => setShowSuggestionsModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              {FOOD_SUGGESTIONS.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionCard}
                  onPress={() => handleSelectSuggestion(suggestion)}
                >
                  <Image source={{ uri: suggestion.imageUrl }} style={styles.suggestionImage} />
                  <View style={styles.suggestionInfo}>
                    <Text style={styles.suggestionName}>{suggestion.name}</Text>
                    <View style={styles.suggestionMacros}>
                      <Text style={styles.suggestionMacro}>{suggestion.calories} cal</Text>
                      <Text style={styles.suggestionMacro}>P: {suggestion.protein}g</Text>
                      <Text style={styles.suggestionMacro}>C: {suggestion.carbs}g</Text>
                      <Text style={styles.suggestionMacro}>F: {suggestion.fat}g</Text>
                    </View>
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
  addButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    padding: 8,
  },
  dateSection: {
    padding: 20,
    paddingBottom: 10,
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
  summaryCard: {
    margin: 20,
    marginTop: 10,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 12,
    color: '#888',
  },
  mealSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  mealIcon: {
    fontSize: 20,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mealBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mealCalories: {
    fontSize: 12,
    fontWeight: '600',
  },
  addMealButton: {
    borderRadius: 6,
    padding: 6,
  },
  foodCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodContent: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  foodImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  foodMacros: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  foodMacro: {
    fontSize: 12,
    color: '#888',
  },
  foodNotes: {
    fontSize: 12,
    color: '#CCCCCC',
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 8,
  },
  emptyMeal: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  emptyMealText: {
    color: '#666',
    fontSize: 14,
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
    maxHeight: '90%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    fontSize: 20,
    color: '#888',
  },
  mealTypeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  mealTypeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#333',
  },
  mealTypeButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  mealTypeIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  mealTypeText: {
    fontSize: 12,
    color: '#CCCCCC',
    textTransform: 'capitalize',
  },
  mealTypeTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  suggestionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF620',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  suggestionsButtonText: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  formGroupHalf: {
    flex: 1,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#333',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  suggestionCard: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },
  suggestionImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  suggestionInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  suggestionMacros: {
    flexDirection: 'row',
    gap: 8,
  },
  suggestionMacro: {
    fontSize: 12,
    color: '#888',
  },
});