import { Button, Title } from "@mantine/core";
import classes from "./Home.style.module.css";
import { Link } from "react-router";
import logoUni from "/src/assets/logos/logouni.png";

const HomePage = () => {
  return (
    <div
      className={classes.hero + " " + "flex flex-col h-full w-full lg:h-screen"}
    >
      <section
        className={
          "flex flex-col max-w-5xl items-center justify-items-center mx-auto mt-16 w-11/12"
        }
      >
        <div className="w-full flex flex-col justify-center items-start p-4 md:flex-row">
          <div className="flex flex-col justify-center items-start w-11/12">
            <Title className="text-white">
              ANTE-PROYECTO:{" "}
              <span className="text-blue-400">CALCULO INTEGRAL</span>
            </Title>
            <Title className="text-white">
              Análisis De Consumo De Recursos Acumulados En Servidores
            </Title>
          </div>

          <img
            className="w-11/12 mt-12 md:w-5/12"
            src={logoUni}
            alt="unilogo"
          />
        </div>

        <div className="flex flex-col mt-12 border-t border-t-blue-300 p-4">
          <Title className="text-white">OBJETIVO:</Title>
          <p className="text-white mt-4 font-bold text-xl">
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

        <div className="flex flex-col mt-8 border-t border-t-blue-300 p-4 w-full">
          <p className="text-white mt-4 font-bold text-xl">
            PROFESOR: MANUEL FEREIRA
          </p>
          <p className="text-white mt-4 font-bold text-xl">ALUMNOS:</p>
          <ul className="text-white mt-4 font-bold text-sm flex justify-around">
            <li>Bryan Sanabria CI:31.708.535</li>
            <li>Nestor Rincón CI:31.851.379</li>
            <li>Neville Gairy CI:30.250.460</li>
          </ul>
        </div>

        <Link to="/metrics">
          <Button className="my-8" variant="gradient" size="xl" radius="xl">
            Empecemos!
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
