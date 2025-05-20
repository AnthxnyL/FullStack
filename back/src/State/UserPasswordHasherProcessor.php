<?php
 
namespace App\State;
 
use App\Entity\User;
use Exception;
use Symfony\Bundle\SecurityBundle\Security;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
 
class UserPasswordHasherProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor,
        private UserPasswordHasherInterface $passwordHasher,
        private Security $security
    ) {
    }
 
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        // Si on n'a pas reçu de valeur pour plainPassword
        if (!$data->getPlainPassword()) {
            // On laisse le process s'exécuter
            return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        }
        // On vérifie que la class courante corresponde à l'utilisateur connecté ET que l'id soit null (sinon ça bloque pour le POST)
        if ($data instanceof User && $data->getId() != null && $data != $this->security->getUser()) {
            throw new Exception('not allowed to edit password');
        }
 
        // Si on a reçu une valeur pour plainPassword, on hash le mot de passe
        $hashedPassword = $this->passwordHasher->hashPassword(
            $data,
            $data->getPlainPassword()
        );
        // On assigne le nouveau mot de passe
        $data->setPassword($hashedPassword);
        // On supprime la valeur de plainPassword
        $data->eraseCredentials();
 
        // On execute le process
        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}