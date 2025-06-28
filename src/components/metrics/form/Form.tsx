/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { schema } from "./Schema";
import { zodResolver } from "@hookform/resolvers/zod";

/*
type Inputs = {
  example: string;
  exampleRequired: string;
};
*/

const FormMetrics = () => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      cpuUsageRate: 10,
      t0: 0,
      t: 24,
      diskUsageValues: [
        { value: 100 },
        { value: 110 },
        { value: 125 },
        { value: 130 },
      ],
      costPerCoreRate: 0.5,
      // --- VALORES POR DEFECTO PARA NUEVOS CAMPOS ---
      cpuCores: 4,
      cpuClockSpeed: 2.5, // en GHz
      ramCapacity: 16, // en GB
      ramUsageRate: 50, // en %
      costPerGBRAM: 0.02, // Costo por GB de RAM por unidad de tiempo
    },
  });

  // --- NUEVOS WATCHERS ---
  // const cpuCores = watch("cpuCores");
  // const cpuClockSpeed = watch("cpuClockSpeed");
  // const ramCapacity = watch("ramCapacity");
  // const ramUsageRate = watch("ramUsageRate");
  // const costPerGBRAM = watch("costPerGBRAM");

  // ... (otros watchers existentes) ...
  // const cpuUsageRate = watch("cpuUsageRate");
  const t0 = watch("t0");
  const t = watch("t");
  // diskUsageValues = watch("diskUsageValues");
  //const costPerCoreRate = watch("costPerCoreRate");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "diskUsageValues",
  });

  const [results, setResults] = useState<any>(null);
  const [calculationError, setCalculationError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // -----------------------------------------------------------------------------
  // 3. Lógica de Cálculo (AÑADIMOS NUEVAS MÉTRICAS)
  // -----------------------------------------------------------------------------
  const calculateMetrics = (data: any) => {
    try {
      setCalculationError("");

      // Parseo de datos existentes
      const parsedCpuUsageRate = parseFloat(data.cpuUsageRate);
      const parsedT0 = parseFloat(data.t0);
      const parsedT = parseFloat(data.t);
      const parsedCostPerCoreRate = parseFloat(data.costPerCoreRate);

      // Parseo de NUEVOS datos
      const parsedCpuCores = parseInt(data.cpuCores); // Entero
      const parsedCpuClockSpeed = parseFloat(data.cpuClockSpeed);
      const parsedRamCapacity = parseFloat(data.ramCapacity);
      const parsedRamUsageRate = parseFloat(data.ramUsageRate);
      const parsedCostPerGBRAM = parseFloat(data.costPerGBRAM);

      // Cálculo de CPU Acumulada (sin cambios)
      const cpuAccumulation = parsedCpuUsageRate * (parsedT - parsedT0);
      if (isNaN(cpuAccumulation))
        throw new Error(
          "Error en el cálculo de CPU acumulada: Datos de entrada inválidos."
        );

      // Cálculo de Crecimiento de Disco (sin cambios)
      let diskGrowth = 0;
      if (data.diskUsageValues && data.diskUsageValues.length >= 2) {
        for (let i = 1; i < data.diskUsageValues.length; i++) {
          const currentDisk = parseFloat(data.diskUsageValues[i].value);
          const previousDisk = parseFloat(data.diskUsageValues[i - 1].value);
          if (isNaN(currentDisk) || isNaN(previousDisk)) {
            throw new Error(
              "Valores de uso de disco inválidos en la sumatoria."
            );
          }
          diskGrowth += currentDisk - previousDisk;
        }
      } else {
        throw new Error(
          "Se requieren al menos dos valores de uso de disco para calcular el crecimiento."
        );
      }
      if (isNaN(diskGrowth))
        throw new Error(
          "Error en el cálculo de crecimiento de disco: Resultado NaN."
        );

      // Cálculo de Costo de CPU (sin cambios)
      const cpuCost =
        parsedCpuUsageRate * parsedCostPerCoreRate * (parsedT - parsedT0);
      if (isNaN(cpuCost))
        throw new Error(
          "Error en el cálculo de costo de CPU: Datos de entrada inválidos."
        );

      // --- NUEVOS CÁLCULOS ---
      // 1. Poder de Procesamiento Teórico Total (ej. en GigaFLOPs o simplemente una métrica combinada)
      // Simplificación: Cores * Velocidad de Reloj
      const totalProcessingPower = parsedCpuCores * parsedCpuClockSpeed;
      if (isNaN(totalProcessingPower))
        throw new Error(
          "Error en el cálculo de poder de procesamiento: Datos de entrada inválidos."
        );

      // 2. Consumo de RAM Acumulado (en GB por unidad de tiempo)
      // Asumimos que ramUsageRate es un porcentaje (0-100)
      const actualRamUsageGB = parsedRamCapacity * (parsedRamUsageRate / 100);
      const ramAccumulatedConsumption = actualRamUsageGB * (parsedT - parsedT0); // GB * Tiempo
      if (isNaN(ramAccumulatedConsumption))
        throw new Error(
          "Error en el cálculo de consumo de RAM: Datos de entrada inválidos."
        );

      // 3. Costo de RAM Acumulado
      const ramCost = ramAccumulatedConsumption * parsedCostPerGBRAM;
      if (isNaN(ramCost))
        throw new Error(
          "Error en el cálculo de costo de RAM: Datos de entrada inválidos."
        );

      // Almacena todos los resultados
      setResults({
        cpuAccumulation: cpuAccumulation.toFixed(2),
        diskGrowth: diskGrowth.toFixed(2),
        cpuCost: cpuCost.toFixed(2),
        // --- NUEVOS RESULTADOS ---
        totalProcessingPower: totalProcessingPower.toFixed(2),
        ramAccumulatedConsumption: ramAccumulatedConsumption.toFixed(2),
        ramCost: ramCost.toFixed(2),
      });

      setShowModal(true);
    } catch (error) {
      console.error("Error durante el cálculo de métricas:", error);
      setCalculationError("Error al calcular");
      setResults(null);
      setShowModal(true);
    }
  };

  const onSubmit = async (data: any) => {
    console.log("Datos del formulario:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    calculateMetrics(data);
  };

  // -----------------------------------------------------------------------------
  // 4. Renderizado del Formulario (AÑADIMOS NUEVAS SECCIONES Y CAMPOS)
  // -----------------------------------------------------------------------------
  return (
    <section className="w-full h-full py-4">
      <div className="bg-white rounded-lg shadow-xl p-8 md:p-10 w-11/12 max-w-4xl border border-gray-200 mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Sección: Acumulación de CPU (sin cambios en inputs, solo descripciones) */}
          <section className="border-b pb-6 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-700 mb-6">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3">
                1
              </span>
              Acumulación de CPU
            </h2>
            <p className="text-gray-600 mb-4 text-sm italic">
              La integral representa la acumulación total de CPU. Para
              simplificar el cálculo en este formulario, asumimos que el uso de
              CPU ($CPU\_usage$) es constante durante el periodo.
              <br />
              Fórmula simplificada: $CPU\_usage \times (t_final:{t} - t_inicial:
              {t0}
              )$
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="cpuUsageRate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tasa de Uso de CPU (unidades/tiempo)
                </label>
                <input
                  id="cpuUsageRate"
                  type="number"
                  step="0.01"
                  {...register("cpuUsageRate", { valueAsNumber: true })}
                  className={`w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ${
                    errors.cpuUsageRate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.cpuUsageRate && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.cpuUsageRate.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="t0"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tiempo Inicial ($t_0$)
                </label>
                <input
                  id="t0"
                  type="number"
                  step="0.01"
                  {...register("t0", { valueAsNumber: true })}
                  className={`w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ${
                    errors.t0 ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.t0 && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.t0.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="t"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tiempo Final ($t_{t}$)
                </label>
                <input
                  id="t"
                  type="number"
                  step="0.01"
                  {...register("t", { valueAsNumber: true })}
                  className={`w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ${
                    errors.t ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.t && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.t.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Sección: Crecimiento y Disponibilidad de Disco (sin cambios en inputs, solo descripciones) */}
          <section className="border-b pb-6 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-700 mb-6">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 mr-3">
                2
              </span>
              Crecimiento de Disco
            </h2>
            <p className="text-gray-600 mb-4 text-sm italic">
              Calcula el aumento o disminución neta en el espacio de disco
              utilizado. Ingrese una serie de valores de uso de disco en
              diferentes momentos; el cálculo sumará las diferencias
              consecutivas.
              <br />
              Fórmula: $\sum (Uso\ del\ punto\ actual - Uso\ del\ punto\
              anterior)$
            </p>
            <div className="space-y-4">
              {fields.map((item, index) => (
                <div key={item.id} className="flex items-center gap-4">
                  <label
                    htmlFor={`diskUsageValues.${index}.value`}
                    className="sr-only"
                  >
                    Uso de Disco en punto {index + 1}
                  </label>
                  <input
                    id={`diskUsageValues.${index}.value`}
                    type="number"
                    step="0.01"
                    {...register(`diskUsageValues.${index}.value`, {
                      valueAsNumber: true,
                    })}
                    className={`flex-grow p-3 border rounded-md focus:ring-green-500 focus:border-green-500 transition duration-150 ${
                      errors.diskUsageValues?.[index]?.value
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder={`Uso de Disco (Punto ${index + 1})`}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    title="Eliminar valor de disco"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              {errors.diskUsageValues && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.diskUsageValues.message}
                </p>
              )}
              <button
                type="button"
                onClick={() => append({ value: 0 })}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Añadir Punto de Uso de Disco
              </button>
            </div>
          </section>

          {/* Sección: Costo y Sostenibilidad de CPU (sin cambios en inputs, solo descripciones) */}
          <section className="border-b pb-6 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-700 mb-6">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 mr-3">
                3
              </span>
              Costo de CPU
            </h2>
            <p className="text-gray-600 mb-4 text-sm italic">
              Calcula el costo total monetario acumulado por el uso de CPU
              durante un periodo. Se asume que tanto la tasa de uso de CPU como
              el costo por core son constantes.
              <br />
              Fórmula simplificada: $CPU\_usage \times Costo\_por\_core \times
              (t_final:
              {t} - t_inicial:{t0})$
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="costPerCoreRate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Costo por Core (unidades monetarias/unidad de tiempo)
                </label>
                <input
                  id="costPerCoreRate"
                  type="number"
                  step="0.01"
                  {...register("costPerCoreRate", { valueAsNumber: true })}
                  className={`w-full p-3 border rounded-md focus:ring-purple-500 focus:border-purple-500 transition duration-150 ${
                    errors.costPerCoreRate
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.costPerCoreRate && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.costPerCoreRate.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* --- NUEVA SECCIÓN: Especificaciones de Hardware y RAM --- */}
          <section className="pb-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-6">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 mr-3">
                4
              </span>
              Especificaciones de Hardware y Costo de RAM
            </h2>
            <p className="text-gray-600 mb-4 text-sm italic">
              Ingrese los detalles del hardware para estimar el poder de
              procesamiento total y el consumo/costo de la RAM.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campos de CPU */}
              <div>
                <label
                  htmlFor="cpuCores"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Número de Núcleos de CPU
                </label>
                <input
                  id="cpuCores"
                  type="number"
                  step="1"
                  {...register("cpuCores", { valueAsNumber: true })}
                  className={`w-full p-3 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ${
                    errors.cpuCores ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.cpuCores && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.cpuCores.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="cpuClockSpeed"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Velocidad de Reloj de CPU (GHz)
                </label>
                <input
                  id="cpuClockSpeed"
                  type="number"
                  step="0.1"
                  {...register("cpuClockSpeed", { valueAsNumber: true })}
                  className={`w-full p-3 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ${
                    errors.cpuClockSpeed ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.cpuClockSpeed && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.cpuClockSpeed.message}
                  </p>
                )}
              </div>

              {/* Campos de RAM */}
              <div>
                <label
                  htmlFor="ramCapacity"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Capacidad Total de RAM (GB)
                </label>
                <input
                  id="ramCapacity"
                  type="number"
                  step="0.1"
                  {...register("ramCapacity", { valueAsNumber: true })}
                  className={`w-full p-3 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ${
                    errors.ramCapacity ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.ramCapacity && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.ramCapacity.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="ramUsageRate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tasa de Uso de RAM (%)
                </label>
                <input
                  id="ramUsageRate"
                  type="number"
                  step="0.1"
                  {...register("ramUsageRate", { valueAsNumber: true })}
                  className={`w-full p-3 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ${
                    errors.ramUsageRate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.ramUsageRate && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.ramUsageRate.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="costPerGBRAM"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Costo por GB de RAM (unidades monetarias/GB/unidad de tiempo)
                </label>
                <input
                  id="costPerGBRAM"
                  type="number"
                  step="0.01"
                  {...register("costPerGBRAM", { valueAsNumber: true })}
                  className={`w-full p-3 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ${
                    errors.costPerGBRAM ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.costPerGBRAM && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.costPerGBRAM.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Botón de Envío */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? "Calculando..." : "Calcular Métricas"}
          </button>
        </form>

        {/* Modal para mostrar resultados o errores (ACTUALIZADO) */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
                title="Cerrar"
              >
                &times;
              </button>
              {calculationError ? (
                <div className="text-red-700 text-center">
                  <h3 className="text-2xl font-bold mb-4">
                    Error en el Cálculo
                  </h3>
                  <p className="text-lg">{calculationError}</p>
                  <p className="mt-4 text-sm text-gray-500">
                    Por favor, revisa tus entradas e inténtalo de nuevo.
                  </p>
                </div>
              ) : (
                <div className="text-gray-800 text-center">
                  <h3 className="text-2xl font-bold mb-4 text-green-600">
                    Resultados del Cálculo
                  </h3>
                  {results && (
                    <div className="space-y-3 text-lg">
                      <p>
                        <strong className="text-blue-600">
                          Acumulación de CPU:
                        </strong>{" "}
                        {results.cpuAccumulation} unidades
                      </p>
                      <p>
                        <strong className="text-green-600">
                          Crecimiento de Disco:
                        </strong>{" "}
                        {results.diskGrowth} unidades
                      </p>
                      <p>
                        <strong className="text-purple-600">
                          Costo de CPU:
                        </strong>{" "}
                        {results.cpuCost} unidades monetarias
                      </p>
                      {/* --- NUEVOS RESULTADOS EN EL MODAL --- */}
                      <p>
                        <strong className="text-yellow-600">
                          Poder de Procesamiento Total (Estimado):
                        </strong>{" "}
                        {results.totalProcessingPower} GHz-cores
                      </p>
                      <p>
                        <strong className="text-yellow-600">
                          Consumo Acumulado de RAM:
                        </strong>{" "}
                        {results.ramAccumulatedConsumption} GB-tiempo
                      </p>
                      <p>
                        <strong className="text-yellow-600">
                          Costo de RAM:
                        </strong>{" "}
                        {results.ramCost} unidades monetarias
                      </p>
                    </div>
                  )}
                  <p className="mt-6 text-sm text-gray-500">
                    Estos cálculos son aproximaciones basadas en tasas
                    constantes para $CPU\_usage(t)$ y $Costo\_por\_core(t)$, y
                    modelos simplificados para hardware.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FormMetrics;
