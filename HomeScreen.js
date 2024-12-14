import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Image, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { AntDesign } from '@expo/vector-icons'; // For the '+' icon and other icons
import { DatePicker } from 'antd';
import DateTimePicker from '@react-native-community/datetimepicker';

const HomeScreen = ({ route }) => {
  const { userName } = route.params;
  const [currentContent, setCurrentContent] = useState('');
  const [experience, setExperience] = useState(0); // Starting experience
  const [level, setLevel] = useState(1); // Starting level
  const [tasks, setTasks] = useState([]); // Array to hold tasks
  const [historyTasks, setHistoryTasks] = useState([]); // Array to hold completed tasks (History)
  const [newTask, setNewTask] = useState(''); // State to store the new task input
  const [isModalVisible, setModalVisible] = useState(false); // State to toggle modal visibility
  const [taskCategory, setTaskCategory] = useState('Habits'); // Default category
  const [categorySelectionVisible, setCategorySelectionVisible] = useState(false); // New state for category selection
  const [userInput, setUserInput] = useState(''); // User input in the modal
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [date, setDate] = useState(new Date()); // State to store selected date
  const [showDatePicker, setShowDatePicker] = useState(false); // State to show date picker
  const [showTimePicker, setShowTimePicker] = useState(false); // State to show time picker

  const showDate = () => setShowDatePicker(true);
  const showTime = () => setShowTimePicker(true);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(false);
    setDueDate(currentDate);
  };

  // Function to handle task completion and gain experience
  const handleTaskCompletion = (points) => {
    const newExperience = experience + points;
    setExperience(newExperience);

    if (newExperience >= level * 1000) {
      setLevel(level + 1);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || dueDate;
    setShowTimePicker(false);
    setDueDate(currentTime); // This will set the time along with the date
  };

  // Function to handle adding a new task
  const handleAddTask = () => {
    if (newTask.trim() === '') {
      Alert.alert('Error', 'Please enter a task name');
      return;
    }

    const task = {
      id: Math.random().toString(), // Unique ID for each task
      name: newTask,
      completed: false,
      xp: 200, // Each task grants 100 XP for completion (can be customized)
      counter: 0, // Initialize counter for tasks
      category: taskCategory, // Add category property to task
      dueDate: date,
    };

    setTasks([task, ...tasks]);
    setNewTask(''); // Clear the input field
    setModalVisible(false); // Close the modal after task is added
  };
  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };
  // Function to handle task completion
  const handleCompleteTask = (taskId, xp) => {
    // Update the tasks array to mark the task as completed
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: true } : task
    );
  
    // Move completed task to the History or Dailies section based on category
    const completedTask = updatedTasks.find(task => task.id === taskId);
    if (completedTask) {
      if (completedTask.category === 'Dailies') {
        // Do not remove from Dailies, just mark as completed
        setTasks(updatedTasks); // Keeps the completed task in Dailies
      } else {
        setHistoryTasks([completedTask, ...historyTasks]); // Add to history
        setTasks(updatedTasks.filter(task => task.id !== taskId)); // Remove from active tasks
      }
    }
  
    handleTaskCompletion(xp); // Gain experience from completing the task
  };
  
  // Function to handle adding or subtracting XP when pressing + or -
  const handleXPChange = (taskId, amount) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId
        ? {
            ...task, 
            xp: task.xp + amount, // Add XP based on the button pressed (+ or -)
            counter: task.counter + (amount > 0 ? 1 : -1) // Increase or decrease counter by 1
          }
        : task
    );

    setTasks(updatedTasks);

    // Update user experience
    if (amount > 0) {
      handleTaskCompletion(200); // Add 200 XP for + button
    } else {
      handleTaskCompletion(-100); // Subtract 100 XP for - button
    }
  };

  // Function to filter tasks based on selected category
  const filteredTasks = currentContent === 'History'
  ? (Array.isArray(historyTasks) ? historyTasks.filter(task => task.category === 'To Do\'s') : [])
  : currentContent === 'Dailies' 
    ? (Array.isArray(tasks) ? tasks.filter(task => task.category === 'Dailies') : [])
    : [
        ...(Array.isArray(tasks) ? tasks.filter(task => task.category === taskCategory && !task.completed) : []),
        ...(Array.isArray(tasks) ? tasks.filter(task => task.completed && task.category === taskCategory) : []),
      ];

  // Function to handle button press and update content
  const handleButtonPress = (content, category) => {
    setCurrentContent(content); // Set the content being displayed
    setTaskCategory(category); // Set the category based on the selected content
  };

  // Function for handling the add button press (toggles modal visibility)
  const handleAddPress = () => {
    setModalVisible(true); // Show the modal when the '+' button is clicked
  };

  const handleCategoryChange = (category) => {
    setTaskCategory(category); // Update category selection
    setCategorySelectionVisible(false); // Close dropdown after selection
  };

  return (
    <View style={styles.container}>
      {/* Upper Section: User Profile */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          {/* Circle around the User Icon */}
          <View style={styles.userIconContainer}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2822/2822371.png' }} // Placeholder user icon
              style={styles.userIcon}
            />
          </View>
          {/* User Info */}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.levelText}>Level: {level}</Text>
            <Text style={styles.experienceText}>Experience: {experience} XP</Text>
          </View>
        </View>
          {/* Notification Icon */}
        <TouchableOpacity style={styles.notificationIcon}>
          <AntDesign name="bells" size={30} color="white" />
        </TouchableOpacity>
      </View>

     {/* Main Content - Scrollable */}
     <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.text}>{currentContent}</Text>

        {/* Outer Box for Task List Margin */}
        <View style={styles.taskListBox}>
          {/* Displaying Task List */}
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <Text style={[styles.taskText, task.completed && styles.completedTask]}>
                  {task.name}
                </Text>
                
                {/* Display the due date of the task */}
                {task.category !== 'Habits' && (
                <Text style={styles.dueDateText}>
                  Due: {task.dueDate.toDateString()} {/* Format the date */}
                </Text>
                )}
                
                {!task.completed && task.category !== 'Habits' && ( // Add this check
                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => handleCompleteTask(task.id, task.xp)}
                  >
                    <Text style={styles.completeButtonText}>Complete</Text>
                  </TouchableOpacity>
                )}
                {task.completed && <Text style={styles.completedText}>Completed</Text>}

                {/* Add + and - buttons for XP change */}
                {!task.completed && task.category !== 'Dailies' && task.category !== 'To Do\'s' && (
                  <View style={styles.xpButtons}>
                    <TouchableOpacity
                      style={[styles.xpButton, { backgroundColor: '#4CAF50' }]} // Green for "+"
                      onPress={() => handleXPChange(task.id, 200)}
                    >
                      <Text style={styles.xpButtonText}>+</Text>
                    </TouchableOpacity>
                    
                    {/* Counter Display */}
                    <Text style={styles.counterText}>{task.counter}</Text>

                    <TouchableOpacity
                      style={[styles.xpButton, { backgroundColor: '#F44336' }]} // Red for "-"
                      onPress={() => handleXPChange(task.id, -100)}
                    >
                      <Text style={styles.xpButtonText}>-</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          ) : (
            <Text>No tasks added yet!</Text>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.navbar}>
        {/* Habits */}
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleButtonPress('Habits', 'Habits')}
        >
          <AntDesign
            name="pluscircleo"
            size={25}
            color={currentContent === 'Habits' ? '#888' : '#fff'} // Change icon color based on selected content
          />
          <Text style={styles.navText}>Habits</Text>
        </TouchableOpacity>

        {/* Dailies */}
        <TouchableOpacity
          style={[styles.navButton, styles.dailiesButton]}
          onPress={() => handleButtonPress('Dailies', 'Dailies')}
        >
          <AntDesign
            name="calendar"
            size={25}
            color={currentContent === 'Dailies' ? '#888' : '#fff'} // Change icon color based on selected content
          />
          <Text style={styles.navText}>Dailies</Text>
        </TouchableOpacity>

        {/* Floating Action Button (FAB) */}
        <TouchableOpacity 
          style={[styles.fab, currentContent === 'History' && styles.disabledFab]} 
          onPress={currentContent === 'History' ? null : handleAddPress} // Disable FAB if 'History' is selected
          disabled={currentContent === 'History'} // Alternatively, use the disabled prop for better semantics
          >
          <AntDesign name="plus" size={24} color="white" style={styles.fabIcon}/>
        </TouchableOpacity>

        {/* To Do's */}
        <TouchableOpacity
          style={[styles.navButton, styles.todoButton]}
          onPress={() => handleButtonPress('To Do\'s', 'To Do\'s')}
        >
          <AntDesign
            name="checkcircleo"
            size={25}
            color={currentContent === 'To Do\'s' ? '#888' : '#fff'} // Change icon color based on selected content
          />
          <Text style={styles.navText}>To Do's</Text>
        </TouchableOpacity>

        {/* History */}
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleButtonPress('History', 'History')}
        >
          <AntDesign
            name="clockcircleo"
            size={25}
            color={currentContent === 'History' ? '#888' : '#fff'} // Change icon color based on selected content
          />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for task creation */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Select Task Category:</Text>
          
          {/* Container for Task Name Input */}
          <View style={styles.inputContainer}>
          {/* Input for task name */}
          <TextInput
            value={newTask}
            onChangeText={setNewTask}
            style={styles.textInput}
            placeholder="Enter task name"
          /></View>
          
          {/* Date Picker Container */}
          <View style={styles.datePickerContainer}>
            {/* Date Picker Button */}
            <TouchableOpacity style={styles.dateButton} onPress={showDatepicker}>
            <Text style={styles.dateButtonText}>
              {date.toDateString()} {/* Display selected date */}
            </Text>
          </TouchableOpacity>


          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          
        </View>
<View>
  <TouchableOpacity 
    style={styles.dropdownButton} 
    onPress={() => setDropdownVisible(!isDropdownVisible)}
  >
    <Text style={styles.dropdownButtonText}>
      {taskCategory ? taskCategory : 'Select a Category'}
    </Text>
    <AntDesign name={isDropdownVisible ? "up" : "down"} size={20} />
  </TouchableOpacity>

  {isDropdownVisible && (
    <View style={styles.dropdownMenu}>
      <TouchableOpacity 
        onPress={() => handleCategoryChange('Habits')} 
        style={styles.dropdownItem}
      >
        <Text style={styles.dropdownText}>Habits</Text>
        {taskCategory === 'Habits' && <AntDesign name="check" size={20} color="green" />}
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => handleCategoryChange('Dailies')} 
        style={styles.dropdownItem}
      >
        <Text style={styles.dropdownText}>Dailies</Text>
        {taskCategory === 'Dailies' && <AntDesign name="check" size={20} color="green" />}
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => handleCategoryChange("To Do's")} 
        style={styles.dropdownItem}
      >
        <Text style={styles.dropdownText}>To Do's</Text>
        {taskCategory === "To Do's" && <AntDesign name="check" size={20} color="green" />}
      </TouchableOpacity>
    </View>
  )}
</View>
          {/* Add Task Button */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
            <Text style={styles.modalButtonText}>Add Task</Text>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#6200EE',
    paddingBottom: 20,
    alignItems: 'flex-start', // 'left' is invalid, use 'flex-start' instead
    borderBottomWidth: 1,
    borderColor: '#ddd',
    borderBottomLeftRadius: 25,  // Rounds the bottom-left corner
    borderBottomRightRadius: 25, // Rounds the bottom-right corner
  },
  notificationIcon: {
    position: 'absolute', // Position it relative to the header
    top: 55, // Adjust the top position to match the header padding
    right: 25, // Position it on the right side of the header
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'left',
  },
  userIconContainer: {
    width: 75, // Width of the circle
    height: 75, // Height of the circle
    borderRadius: 50, // This makes it a circle
    borderWidth: 2,
    borderColor: '#fff', // Border color (optional)
    overflow: 'hidden', // To ensure the image stays inside the circle
    marginRight: 10,
  },
  userIcon: {
    width: '100%', // Makes the image fill the circle
    height: '100%', // Makes the image fill the circle
    borderRadius: 30, // Ensures the image itself is round inside the circle
  },
  userInfo: {
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    paddingBottom: 5,
  },
  levelText: {
    fontSize: 18,
    color: '#fff',
  },
  experienceText: {
    fontSize: 13,
    color: '#fff',
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskListBox: {
    marginTop: 20, // Margin for the whole task list box
    padding: 10, // Padding around the task list
    backgroundColor: '#f0f0f0',
    borderRadius: 10, // Rounded corners for the task list box
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  taskItem: {
    padding: 10,
    marginVertical: 8, // Space between each task
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  completeButton: {
    marginTop: 10,
    backgroundColor: '#6200EE',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  completedText: {
    color: '#4caf50',
    fontSize: 14,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#6200EE',
    paddingVertical: 13,
  },
  navButton: {
    alignItems: 'center',
    marginHorizontal: 2,  // Add horizontal space between buttons (adjust the value here)
  },
  dailiesButton: {
    marginRight: 30, // Adds space to the right of the "Dailies" button
  },
  todoButton: {
    marginLeft: 30, // Adds space to the left of the "To Do's" button
  },
  navText: {
    color: '#fff',
    fontSize: 14,
  },
  fab: {
    backgroundColor: '#925ef0', // Background color of the FAB
    width: 60, // Width of the square
    height: 60, // Height of the square
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 41, // Position the FAB 50px from the bottom
    left: '50%', // Centers the FAB horizontally
    marginLeft: -32, // Offsets the FAB to truly center it (half of its width)
    transform: [{ rotate: '45deg' }], // Apply the rotation for the tilted square
    borderWidth: 6,
    borderColor: '#fff'
  },
  disabledFab: {
    backgroundColor: '#fff', // Change color when disabled
    borderColor: '#fff', // Lighter border color to indicate it's disabled
  },
  fabIcon: {
    transform: [{ rotate: '45deg' }], // Apply rotation to only the icon (tilting the plus)
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'row',  // Center everything inside the modal vertically
    flexDirection: 'column', // Stack elements vertically in the modal content (for title and input)
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#32CD32',
    paddingVertical: 13, // Adjust padding for "Add Task"
    paddingHorizontal: 20, // Adjust horizontal padding
    borderRadius: 5,
    marginBottom: 5,
    marginTop: 9,
    alignItems: 'center', // Center the text
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',  // Ensure text is centered horizontally
  },
  closeButton: {
    backgroundColor: '#F44336',
    paddingVertical: 12, // Adjust padding for "Close"
    paddingHorizontal: 30, // Adjust horizontal padding
    borderRadius: 5,
    alignItems: 'center', // Center the text
  },
  closeButtonText: {
    color: '#333',
    fontSize: 16,
  },
  xpButtons: {
    flexDirection: 'row',        // Buttons will be in a horizontal row. Set to 'column' for vertical stacking
    justifyContent: 'center',    // Centers buttons horizontally within their container
    alignItems: 'center',        // Aligns buttons vertically in the center
    marginTop: 8,               // Space above the buttons
  },
  xpButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,         // Adjusts vertical padding (height of the button)
    paddingHorizontal: 16,       // Adjusts horizontal padding (width of the button)
    borderRadius: 10,            // Rounded corners
    marginHorizontal: 25,        // Space between the two buttons
    width: 100,                   // Fixed width for the button (you can adjust this)
    height: 33,                  // Fixed height for the button (you can adjust this)
    justifyContent: 'center',    // Center the content inside the button
    alignItems: 'center',        // Align text in the middle of the button
  },
  xpButtonText: {
    color: '#fff',
    fontSize: 15,                // Adjusts the font size for the text inside the button
    textAlign: 'center',         // Centers the text inside the button
    lineHeight: 13,              // Adjusts the height of the text inside the button
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownMenu: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 5,
  },
  dropdownItem: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },

  counterText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 10, // Space between +, counter, and -
    color: '#333',
  },
  dateButton: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 0,
  },
  dateButtonText: {
    color: 'black',
    fontSize: 16,
  },
  datePickerContainer: {
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#ccc', // Set the background color
    padding: 1, // Optional: Add padding for spacing inside the container
    borderRadius: 8, // Optional: Rounded corners for the container
    borderWidth: 1, // Set the border width (adjust as needed)
  },
    inputContainer: {
    marginBottom: 15, // Add space below the input field
    padding: 10, // Padding inside the container
    borderWidth: 1, // Border around the container
    borderColor: '#ccc', // Border color
    borderRadius: 8, // Rounded corners for the container
  },
  dueDateText: {
    fontSize: 12,
    color: '#888', // Lighter color for the date
    marginTop: 5,  // Spacing between task name and date
  },

});

export default HomeScreen;
