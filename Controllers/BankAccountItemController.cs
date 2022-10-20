using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BankApi.Models;

namespace BankApi.Controllers
{
    [Route("api/BankAccountItem")]
    [ApiController]
    public class BankAccountItemController : ControllerBase
    {
        private readonly BankContext _context;

        public BankAccountItemController(BankContext context)
        {
            _context = context;
        }

        // GET: api/BankAccountItem
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BankAccount>>> GetBankAccounts()
        {
          if (_context.BankAccounts == null)
          {
              return NotFound();
          }
            return await _context.BankAccounts.ToListAsync();
        }

        // GET: api/BankAccountItem/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BankAccount>> GetBankAccount(long id)
        {
          if (_context.BankAccounts == null)
          {
              return NotFound();
          }
            var bankAccount = await _context.BankAccounts.FindAsync(id);

            if (bankAccount == null)
            {
                return NotFound();
            }

            return bankAccount;
        }

        // PUT: api/BankAccountItem/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBankAccount(long id, BankAccount bankAccount)
        {
            if (id != bankAccount.Id)
            {
                return BadRequest();
            }

            _context.Entry(bankAccount).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BankAccountExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/BankAccountItem
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<BankAccount>> PostBankAccount(BankAccount bankAccount)
        {
          if (_context.BankAccounts == null)
          {
              return Problem("Entity set 'BankContext.BankAccounts'  is null.");
          }
            _context.BankAccounts.Add(bankAccount);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBankAccount), new { id = bankAccount.Id }, bankAccount);
        }

        // DELETE: api/BankAccountItem/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBankAccount(long id)
        {
            if (_context.BankAccounts == null)
            {
                return NotFound();
            }
            var bankAccount = await _context.BankAccounts.FindAsync(id);
            if (bankAccount == null)
            {
                return NotFound();
            }

            _context.BankAccounts.Remove(bankAccount);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BankAccountExists(long id)
        {
            return (_context.BankAccounts?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
