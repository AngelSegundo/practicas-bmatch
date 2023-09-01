import { ServiceConnectionRepository } from "../../repositories/service-connection-repository";
import { ServiceConnection, ServiceConnectionStatus } from "../../entities/service-connection";
import { CreateServiceConnectionUseCaseImpl } from '../../useCases/serviceConnections/create-service-connection';
import { ServiceType } from "../../entities";

describe("CreateServiceConnectionUseCase", () => {
  let useCase: CreateServiceConnectionUseCaseImpl;
  let repository: ServiceConnectionRepository;
  let mockServiceConnection: ServiceConnection;

  beforeEach(() => {
    mockServiceConnection = {
      serviceId: "service123",
      userId: "user123",
      config: {
        clientId: "client123"
      },
      alias: 'cassa',
      status: ServiceConnectionStatus.pending,
      type: ServiceType.water,
      serviceKey: "serviceKey"
    };

    useCase = new CreateServiceConnectionUseCaseImpl(repository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should create a new service connection", async () => {
   repository.getServiceConnectionsByUserId(mockServiceConnection.userId);

    const result = await useCase.execute(mockServiceConnection);

    expect(repository.createServiceConnection).toHaveBeenCalledTimes(1);
    expect(repository.createServiceConnection).toHaveBeenCalledWith(
      mockServiceConnection
    );
    expect(result).toEqual({
      userId: mockServiceConnection.userId,
      serviceId: mockServiceConnection.serviceId,
      config: mockServiceConnection.config,
    });
  });

  it("should throw an error if a service connection already exists with the same client ID and service type", async () => {
    const existingServiceConnection: ServiceConnection = {
     serviceId: "service123",
     userId: "user123",
     config: {
       clientId: "client123"
     },
     alias: 'casa',
     status: ServiceConnectionStatus.pending,
     type: ServiceType.water,
     serviceKey: "serviceKey"
    };

    repository.getServiceConnectionsByUserId(
      existingServiceConnection.userId,
    );

    await expect(useCase.execute(mockServiceConnection)).rejects.toThrow(
      `already-in-use`
    );

    expect(repository.createServiceConnection).not.toHaveBeenCalled();
  });
});