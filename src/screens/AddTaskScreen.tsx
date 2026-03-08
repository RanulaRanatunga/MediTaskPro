import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Picker } from "@react-native-picker/picker";
import { useTasks } from "../hooks/useTasks";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { theme } from "../constants/theme";
import { useColorScheme } from "react-native";
import { TextInput } from "react-native";
import { Todo, todoService } from "../api/todoService";
import Toast from "react-native-toast-message";

type RootStackParamList = {
  AddTask: { task?: Todo };
};

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  priority: yup.string().oneOf(["Low", "Medium", "High"]).required(),
});

type FormData = yup.InferType<typeof schema>;

const AddTaskScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "AddTask">>();
  const task = route.params?.task;
  const isEdit = !!task;
  const { createTask } = useTasks();
  const colorScheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = theme[colorScheme];

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { title: "", description: "", priority: "Medium" },
  });

  useEffect(() => {
    if (isEdit && task) {
      setValue("title", task.title);
      setValue("description", task.description);
      setValue("priority", task.priority);
      navigation.setOptions({ title: "Edit Task" });
    }
  }, [isEdit, task, setValue, navigation]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit && task) {
        await todoService.update(task.id, data);
        Toast.show({ type: "success", text1: "Task updated!" });
      } else {
        createTask({
          ...data,
          status: "Pending",
        });
      }
      reset();
      navigation.goBack();
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to save task" });
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.label, { color: colors.text }]}>Title</Text>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.card, color: colors.text },
            ]}
            value={value}
            onChangeText={onChange}
            placeholderTextColor={colors.textSecondary}
          />
        )}
      />
      {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}
      <Text style={[styles.label, { color: colors.text }]}>Description</Text>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.card, color: colors.text, height: 100 },
            ]}
            value={value}
            onChangeText={onChange}
            multiline
            placeholderTextColor={colors.textSecondary}
          />
        )}
      />
      {errors.description && (
        <Text style={styles.error}>{errors.description.message}</Text>
      )}
      <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
      <Controller
        control={control}
        name="priority"
        render={({ field: { onChange, value } }) => (
          <View
            style={[styles.pickerContainer, { backgroundColor: colors.card }]}
          >
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              style={{ color: colors.text }}
            >
              <Picker.Item label="Low" value="Low" />
              <Picker.Item label="Medium" value="Medium" />
              <Picker.Item label="High" value="High" />
            </Picker>
          </View>
        )}
      />
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.saveText}>
          {isEdit ? "Update Task" : "Save Task"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: "600", marginTop: 15, marginBottom: 5 },
  input: {
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  pickerContainer: { borderRadius: 12, borderWidth: 1, borderColor: "#ddd" },
  error: { color: "red", fontSize: 12, marginTop: 4 },
  saveButton: {
    marginTop: 30,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default AddTaskScreen;
