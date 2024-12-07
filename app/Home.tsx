import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import CarRepository, { Car } from "../src/database/CarRepository";

const repository = new CarRepository();

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [min, setMin] = useState("0");
  const [max, setMax] = useState("100");

  const carModels = ["Fusca", "Patinete", "F1000"];

  const create = async () => {
    const randomModel = carModels[Math.floor(Math.random() * carModels.length)];
    const id = await repository.create({
      brand: "VW",
      model: randomModel,
      hp: Math.floor(Math.random() * 100),
    });
    console.log("Created: ", id);

    await all();
  };

  const remove = async (id: number) => {
    await repository.delete(id);

    console.log(`Car id ${id} deleted`);
    await all();
  };

  const update = async (id: number, car: Car) => {
    await repository.update(id, car);

    console.log(`Car id ${id} updated`);
    await all();
  };

  const all = async () => {
    const cars = await repository.all();
    setCars(cars);

    console.log(cars);
  };

  const searchByModel = async (model: string) => {
    const cars = await repository.findByModel(model);
    setCars(cars);

    console.log(cars);
  };

  const searchByHpRange = async (min: number, max: number) => {
    const cars = await repository.findHpBetween(min, max);
    setCars(cars);

    console.log(cars);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={create} style={styles.button}>
        <Text style={styles.buttonText}>create</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={all} style={styles.button}>
        <Text style={styles.buttonText}>all</Text>
      </TouchableOpacity>

      {cars.map((car) => (
        <View key={car.id} style={styles.carItem}>
          <Text>{car.id} - </Text>
          <Text>
            {car.brand} {car.model} {car.hp}
          </Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={() => remove(car.id!)}
              style={styles.iconButton}
            >
              <Icon name="trash" size={20} color="red" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                const randomModel =
                  carModels[Math.floor(Math.random() * carModels.length)];
                const updatedCar = {
                  brand: "VW",
                  model: randomModel,
                  hp: Math.floor(Math.random() * 100),
                };
                update(car.id!, updatedCar);
              }}
              style={styles.iconButton}
            >
              <Icon name="edit" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Enter Model to search"
          value={selectedModel}
          onChangeText={setSelectedModel}
        />
        <Text>Available models: Fusca, F1000 or Patinete</Text>
        <TouchableOpacity
          onPress={() => {
            if (!carModels.includes(selectedModel)) {
              console.log("Please enter a valid model");
              return;
            }

            searchByModel(selectedModel);
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Search Model</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Enter HP Min Value"
          value={min.toString()}
          onChangeText={(text) => setMin(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter HP Max Value"
          value={max.toString()}
          onChangeText={(text) => setMax(text)}
        />
        <TouchableOpacity
          onPress={() => searchByHpRange(parseInt(min), parseInt(max))}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Search HP Range</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingVertical: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  carItem: {
    marginVertical: 10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  iconButton: {
    marginHorizontal: 5,
  },
  input: {
    height: 40,
    width: 200,
    borderRadius: 10,
    borderColor: "gray",
    backgroundColor: "white",
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  button: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
    backgroundColor: "white",
    width: 200,
  },
  buttonText: {
    color: "black",
    textAlign: "center",
  },
});
