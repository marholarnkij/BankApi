using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;

namespace BankApi.Models
{
    public class BankContext : DbContext
    {
        public BankContext(DbContextOptions<BankContext> options)
            : base(options)
        {
        }

        public DbSet<BankAccount> BankAccounts { get; set; } = null!;
        public DbSet<Transaction> Transactions { get; set; } = null!;
    }
}