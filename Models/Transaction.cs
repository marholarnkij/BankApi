namespace BankApi.Models
{
    public class Transaction
    {
        public long TransactionId { get; set; }
        public string? IbanFrom {get;set;}
        public string? IbanTo  {get;set;}
        public TransactionType TransactionType {get;set;}
        public decimal Amount {get;set;}
        public DateTime TransactionDate{get;set;}
    }
}