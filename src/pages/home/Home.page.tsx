import { Button, Overlay, Title } from "@mantine/core";
import classes from "./Home.style.module.css";

const HomePage = () => {
  return (
    <div className={classes.hero + " " + "flex flex-col h-screen"}>
      <section
        className={
          "flex flex-col max-w-5xl items-center justify-items-center mx-auto mt-22 px-16"
        }
      >
        <Overlay
          gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
          opacity={0.25}
          zIndex={0}
        />
        <div className="flex flex-col justify-center items-start">
          <Title className="text-white">
            ANTE-PROJECTO:{" "}
            <span className="text-blue-400">CALCULO INTEGRAL</span>
          </Title>
          <Title className="text-white">
            Análisis De Consumo De Recursos Acumulados En Servidores
          </Title>
        </div>

        <img
          className="w-full max-w-3xl bg-white rounded-2xl mt-12"
          src="/src/assets/logos/logouni.png"
          alt="unilogo"
        />

        <div className="flex flex-col mt-12">
          <Title className="text-white">OBJETIVO:</Title>
          <p className="text-white mt-4 font-bold text-xl bg-black p-4">
            Estudiar el consumo acumulado de recursos (CPU, memoria,
            almacenamiento y red) en los servidores, identificando sus patrones
            de uso, optimizando su rendimiento y mejorando la planificación de
            la capacidad de la infraestructura, para disminuir los costos
            operativos y mejorar la disponibilidad del servicio. El cálculo
            integral permite modelar el uso de los recursos a través del tiempo,
            en el que lo que eran mediciones discretas se suceden en patrones de
            uso de esos recursos.
          </p>
        </div>

        <Button variant="gradient" size="xl" radius="xl">
          Empezemos!
        </Button>
      </section>
    </div>
  );
};

export default HomePage;
