 
namespace BankApi.Models
{
    public class BankAccount
    {
        public long Id { get; set; }
        public Int64 AccountNumber {get;set;}
        public string? AccountName {get;set;}
        public string? IBAN { get;set;}
        public decimal Balance {get;set;}
        public decimal Fee {get;set;}
    }
}