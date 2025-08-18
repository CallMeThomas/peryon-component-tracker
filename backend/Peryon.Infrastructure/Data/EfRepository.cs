using Ardalis.Specification.EntityFrameworkCore;
using Peryon.SharedKernel.Interfaces;

namespace Peryon.Infrastructure.Data;

public class EfRepository<T>(AppDbContext dbContext) :
    RepositoryBase<T>(dbContext), IRepository<T> where T : class, IAggregateRoot
{
}
