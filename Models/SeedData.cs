using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using BankApi.Models;
using System;
using System.Linq;

namespace BankApi.Models
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using(var context = new BankContext(
                serviceProvider.GetRequiredService<
                DbContextOptions<BankContext>>()))
            {
                if(context.BankAccounts.Any())
                {
                    return;
                }
                context.BankAccounts.AddRange(
                    new BankAccount
                    {
                        Id = 1,
                        AccountNumber = 1234560001,
                        AccountName = "Bank Name 1",
                        IBAN = "NL25ABNA7798392807",
                        Balance = 0M,
                        Fee = 0.0M
                    },
                    new BankAccount
                    {
                        Id = 2,
                        AccountNumber = 1234560002,
                        AccountName = "Bank Name 2",
                        IBAN = "NL59INGB9906008334",
                        Balance = 0M,
                        Fee = 0.0M
                    }

                );
                context.SaveChanges();
            }
        }
    }
}