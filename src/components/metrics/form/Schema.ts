import * as z from "zod";

export const schema = z.object({
  // Sección de Cálculo Integral CPU (Acumulación)
  cpuUsageRate: z
    .number({
      required_error: "El uso de CPU es requerido",
      invalid_type_error: "El uso de CPU debe ser un número",
    })
    .min(0.01, "El uso de CPU debe ser mayor que 0")
    .positive("El uso de CPU debe ser un valor positivo"),
  t0: z
    .number({
      required_error: "El tiempo inicial (t0) es requerido",
      invalid_type_error: "El tiempo inicial (t0) debe ser un número",
    })
    .min(0, "El tiempo inicial (t0) no puede ser negativo"),
  t: z.number({
    required_error: "El tiempo final (t) es requerido",
    invalid_type_error: "El tiempo final (t) debe ser un número",
  }),
  //"El tiempo final (t) debe ser mayor o igual al tiempo inicial (t0)",

  // Sección de Crecimiento de Disco (Sumatoria)
  diskUsageValues: z
    .array(
      z.object({
        value: z
          .number({
            required_error: "El valor de uso de disco es requerido",
            invalid_type_error: "El valor de uso de disco debe ser un número",
          })
          .min(0, "El uso de disco no puede ser negativo"),
      })
    )
    .min(
      2,
      "Se requieren al menos dos valores de uso de disco para calcular el crecimiento"
    ),

  // Sección de Costo CPU (Integral)
  costPerCoreRate: z
    .number({
      required_error: "El costo por core es requerido",
      invalid_type_error: "El costo por core debe ser un número",
    })
    .min(0, "El costo por core no puede ser negativo")
    .positive("El costo por core debe ser un valor positivo"),
  cpuCores: z
    .number({
      required_error: "El número de núcleos de CPU es requerido",
      invalid_type_error: "El número de núcleos debe ser un número entero",
    })
    .int("El número de núcleos debe ser un número entero")
    .min(1, "Debe haber al menos 1 núcleo de CPU")
    .positive("El número de núcleos debe ser positivo"),
  cpuClockSpeed: z
    .number({
      required_error: "La velocidad de reloj de la CPU es requerida",
      invalid_type_error: "La velocidad de reloj debe ser un número",
    })
    .min(0.1, "La velocidad de reloj debe ser mayor que 0")
    .positive("La velocidad de reloj debe ser positiva"),
  ramCapacity: z
    .number({
      required_error: "La capacidad de RAM es requerida",
      invalid_type_error: "La capacidad de RAM debe ser un número",
    })
    .min(0.1, "La capacidad de RAM debe ser mayor que 0")
    .positive("La capacidad de RAM debe ser positiva"),
  ramUsageRate: z
    .number({
      required_error: "La tasa de uso de RAM es requerida",
      invalid_type_error: "La tasa de uso de RAM debe ser un número",
    })
    .min(0, "La tasa de uso de RAM no puede ser negativa")
    .max(100, "La tasa de uso de RAM no puede exceder el 100%"), // Asumiendo porcentaje de uso
  costPerGBRAM: z
    .number({
      required_error: "El costo por GB de RAM es requerido",
      invalid_type_error: "El costo por GB de RAM debe ser un número",
    })
    .min(0, "El costo por GB de RAM no puede ser negativo")
    .positive("El costo por GB de RAM debe ser positivo"),
});
