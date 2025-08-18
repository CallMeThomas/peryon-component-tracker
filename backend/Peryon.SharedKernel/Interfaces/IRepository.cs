using Ardalis.Specification;

namespace Peryon.SharedKernel.Interfaces;

public interface IRepository<T>: IRepositoryBase<T> where T : class, IAggregateRoot
{
}
