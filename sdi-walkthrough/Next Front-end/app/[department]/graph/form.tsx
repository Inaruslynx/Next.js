"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { ChartData } from "chart.js";
import api from "@/utils/api";

const FormSchema = z.object({
  dataSelection: z.string().min(1, { message: "Please select a data point." }),
  fromDatePicker: z.date(),
  toDatePicker: z.date(),
});

interface PostResponse {
  data: [{ date: string; value: number }];
}

interface GraphFormProps {
  onDataFromChild: (data: ChartData<"line">) => void;
  options: string[];
  fromDate: string;
  toDate: string;
}

export default function GraphForm({
  onDataFromChild,
  options,
  fromDate,
  toDate,
}: GraphFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dataSelection: options[0],
      fromDatePicker: new Date(fromDate),
      toDatePicker: new Date(toDate),
    },
  });
  //   console.log("fromDate:", fromDate);
  //   console.log("toDate:", toDate);

  async function onSubmit(Data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(Data, null, 2)}</code>
        </pre>
      ),
    });
    try {
      // Make Axios POST request with input data
      // response should be [{date: Date, value: number}]
      //   console.log("form data:", Data);
      const response: PostResponse = await api.post(
        "http://fs3s-hotmilllog/HM_Walkthrough/api/graph",
        {
          dataSelection: Data.dataSelection,
          fromDate: Data.fromDatePicker.toISOString(),
          toDate: Data.toDatePicker.toISOString(),
        }
      );
      //   console.log("recieved data:", response);
      const labels: string[] = response.data.map((item) => item.date);
      const data: number[] = response.data.map((item) => item.value);

      // Set the results in state
      onDataFromChild({ labels, datasets: [{ data }] });
    } catch (error) {
      console.error("Error fetching graph data:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid lg:grid-cols-4 gap-4 items-end">
          <div>
            <FormField
              control={form.control}
              name="dataSelection"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data Point</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a data point" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-base-100">
                      {options.map((datapoint) => (
                        <SelectItem
                          className=""
                          key={datapoint}
                          value={datapoint}
                        >
                          {datapoint}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="fromDatePicker"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>From Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 bg-opacity-100 opacity-100"
                      align="start"
                    >
                      <Calendar
                        className="bg-base-100"
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="toDatePicker"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>To Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        className="bg-base-100"
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            className="btn btn-primary bg-primary bg-opacity-100 opacity-100"
            type="submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
