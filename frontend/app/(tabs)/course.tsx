import { StyleSheet, View } from 'react-native';
import CourseScreen from '@/screens/CourseScreen';

export default function CoursesScreen() {
  return (
    <View style={styles.container}>
      <CourseScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, 
    paddingHorizontal: 16,
    width: '100%',
    paddingTop: 30, 
  },
});