using System;

namespace FibonacciApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            int n = 10;
            PrintFibonacci(n);
        }

        public static void PrintFibonacci(int count)
        {
            if (count <= 0)
            {
                return;
            }

            long a = 0, b = 1;
            Console.Write(a);

            for (int i = 1; i < count; i++)
            {
                long temp = a + b;
                a = b;
                b = temp;
                Console.Write(", " + a);
            }

            Console.WriteLine();
        }
    }
}
