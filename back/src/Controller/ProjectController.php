<?php

namespace App\Controller;

use App\Entity\Project;
use App\Entity\User;
use App\Repository\ProjectRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\String\Slugger\SluggerInterface;

class ProjectController extends AbstractController
{
    #[Route('/api/projects/create', name: 'project_create_with_image', methods: ['POST'], defaults: ['_api_receive' => false])]
    public function createProject(
        Request $request,
        EntityManagerInterface $entityManager,
        SluggerInterface $slugger,
        ProjectRepository $projectRepository,
        SerializerInterface $serializer,
        UserRepository $userRepository
    ): JsonResponse {
        try {
            // Créer un fichier de log pour le débogage
            $logDir = $this->getParameter('kernel.project_dir') . '/var/log';
            if (!is_dir($logDir)) {
                mkdir($logDir, 0777, true);
            }

            $logFile = $logDir . '/debug_project.log';
            file_put_contents($logFile, date('Y-m-d H:i:s') . ' - Début du traitement' . PHP_EOL, FILE_APPEND);

            // Enregistrer les informations de la requête
            file_put_contents($logFile, 'POST data: ' . print_r($request->request->all(), true) . PHP_EOL, FILE_APPEND);
            file_put_contents($logFile, 'FILES data: ' . print_r($request->files->all(), true) . PHP_EOL, FILE_APPEND);

            // Vérifier le répertoire de destination
            $uploadDir = $this->getParameter('project_images_directory');
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
                file_put_contents($logFile, 'Création du répertoire: ' . $uploadDir . PHP_EOL, FILE_APPEND);
            }

            // Vérifier les permissions du répertoire
            if (!is_writable($uploadDir)) {
                file_put_contents($logFile, 'ERREUR: Le répertoire ' . $uploadDir . ' n\'est pas accessible en écriture' . PHP_EOL, FILE_APPEND);
                return new JsonResponse(['error' => 'Le répertoire de destination n\'est pas accessible en écriture'], Response::HTTP_INTERNAL_SERVER_ERROR);
            }

            // Récupérer les données du formulaire
            $title = $request->request->get('title');
            $description = $request->request->get('description');
            $date = $request->request->get('date');
            $is_active = $request->request->get('is_active') === 'true';
            $techno_used = json_decode($request->request->get('techno_used') ?? '[]', true);
            $studentIds = json_decode($request->request->get('student') ?? '[]', true);

            // Créer un nouveau projet
            $project = new Project();
            $project->setTitle($title);
            $project->setDescription($description);
            $project->setDate(new \DateTime($date));
            $project->setIsActive($is_active);
            $project->setTechnoUsed($techno_used);

            // Gestion de l'image
            $uploadedFile = $request->files->get('imageFile');
            if ($uploadedFile) {
                file_put_contents($logFile, 'Traitement du fichier: ' . $uploadedFile->getClientOriginalName() . PHP_EOL, FILE_APPEND);

                // Vérification du type MIME
                $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
                $fileMimeType = $uploadedFile->getMimeType();
                file_put_contents($logFile, 'Type MIME: ' . $fileMimeType . PHP_EOL, FILE_APPEND);

                if (!in_array($fileMimeType, $allowedMimeTypes)) {
                    file_put_contents($logFile, 'Type MIME non autorisé: ' . $fileMimeType . PHP_EOL, FILE_APPEND);
                    return new JsonResponse([
                        'error' => 'Type de fichier non autorisé',
                        'mime' => $fileMimeType,
                        'allowed' => $allowedMimeTypes
                    ], Response::HTTP_BAD_REQUEST);
                }

                $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
                $safeFilename = $slugger->slug($originalFilename);
                $newFilename = $safeFilename . '-' . uniqid() . '.' . $uploadedFile->guessExtension();
                file_put_contents($logFile, 'Nouveau nom de fichier: ' . $newFilename . PHP_EOL, FILE_APPEND);

                try {
                    $uploadDir = $this->getParameter('project_images_directory');
                    $fullPath = $uploadDir . '/' . $newFilename;
                    file_put_contents($logFile, 'Déplacement du fichier vers: ' . $fullPath . PHP_EOL, FILE_APPEND);

                    $uploadedFile->move(
                        $uploadDir,
                        $newFilename
                    );
                    $project->setImage($newFilename);
                    file_put_contents($logFile, 'Fichier déplacé avec succès' . PHP_EOL, FILE_APPEND);
                } catch (FileException $e) {
                    file_put_contents($logFile, 'Erreur lors du déplacement du fichier: ' . $e->getMessage() . PHP_EOL, FILE_APPEND);
                    return new JsonResponse(['error' => 'Erreur lors du téléchargement de l\'image: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
                }
            }

            // Ajouter les étudiants
            if (!empty($studentIds)) {
                file_put_contents($logFile, 'Traitement des étudiants: ' . json_encode($studentIds) . PHP_EOL, FILE_APPEND);

                foreach ($studentIds as $studentId) {
                    try {
                        $student = $userRepository->find($studentId);
                        if ($student) {
                            file_put_contents($logFile, 'Ajout de l\'étudiant ID: ' . $studentId . PHP_EOL, FILE_APPEND);
                            $project->addStudent($student);
                        } else {
                            file_put_contents($logFile, 'Étudiant non trouvé ID: ' . $studentId . PHP_EOL, FILE_APPEND);
                        }
                    } catch (\Exception $e) {
                        file_put_contents($logFile, 'Erreur lors de l\'ajout de l\'étudiant: ' . $e->getMessage() . PHP_EOL, FILE_APPEND);
                    }
                }
            } else {
                file_put_contents($logFile, 'Aucun étudiant sélectionné' . PHP_EOL, FILE_APPEND);
            }

            $entityManager->persist($project);
            $entityManager->flush();

            // Créer un tableau avec les données du projet
            $responseData = [
                'id' => $project->getId(),
                'title' => $project->getTitle(),
                'description' => $project->getDescription(),
                'date' => $project->getDate()->format('Y-m-d'),
                'is_active' => $project->getIsActive(),
                'techno_used' => $project->getTechnoUsed(),
                'image' => $project->getImage()
            ];

            // Ajouter les étudiants
            $students = [];
            foreach ($project->getStudent() as $student) {
                $students[] = [
                    'id' => $student->getId(),
                    'first_name' => $student->getFirstName(),
                    'last_name' => $student->getLastName(),
                    'email' => $student->getEmail()
                ];
            }
            $responseData['student'] = $students;

            return new JsonResponse($responseData, Response::HTTP_CREATED);
        } catch (\Exception $e) {
            // Log l'erreur pour le débogage
            file_put_contents(
                __DIR__ . '/../../var/log/error_debug.log',
                date('Y-m-d H:i:s') . " - Error: " . $e->getMessage() . PHP_EOL .
                "Trace: " . $e->getTraceAsString() . PHP_EOL,
                FILE_APPEND
            );

            // Retourner une erreur JSON au lieu de laisser Symfony générer une page d'erreur HTML
            $response = new JsonResponse([
                'error' => 'Une erreur est survenue lors de la création du projet',
                'message' => $e->getMessage(),
                'detail' => $e->getTraceAsString()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);

            return $response;
        }
    }

    #[Route('/api/projects/{id}/update', name: 'project_update_with_image', methods: ['POST'], defaults: ['_api_receive' => false])]
    public function updateProject(
        Request $request,
        Project $project,
        EntityManagerInterface $entityManager,
        SluggerInterface $slugger,
        SerializerInterface $serializer,
        UserRepository $userRepository
    ): JsonResponse {
        try {
            // Récupérer les données du formulaire
            $title = $request->request->get('title');
            $description = $request->request->get('description');
            $date = $request->request->get('date');
            $is_active = $request->request->get('is_active') === 'true';
            $techno_used = json_decode($request->request->get('techno_used') ?? '[]', true);
            $studentIds = json_decode($request->request->get('student') ?? '[]', true);

            // Mettre à jour le projet
            $project->setTitle($title);
            $project->setDescription($description);
            $project->setDate(new \DateTime($date));
            $project->setIsActive($is_active);
            $project->setTechnoUsed($techno_used);

            // Gérer la suppression d'image si demandée
            if ($request->request->get('removeImage') === 'true') {
                if ($project->getImage()) {
                    $oldImagePath = $this->getParameter('project_images_directory') . '/' . $project->getImage();
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                    $project->setImage(null);
                }
            }

            // Mise à jour des étudiants
            // D'abord, supprimer tous les étudiants existants
            foreach ($project->getStudent() as $existingStudent) {
                $project->removeStudent($existingStudent);
            }

            // Ensuite, ajouter les étudiants sélectionnés
            if (!empty($studentIds)) {
                foreach ($studentIds as $studentId) {
                    $student = $userRepository->find($studentId);
                    if ($student) {
                        $project->addStudent($student);
                    }
                }
            }

            // Gestion de l'image
            $uploadedFile = $request->files->get('imageFile');
            if ($uploadedFile) {
                // Vérification du type MIME
                $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
                if (!in_array($uploadedFile->getMimeType(), $allowedMimeTypes)) {
                    return new JsonResponse([
                        'error' => 'Type de fichier non autorisé',
                        'mime' => $uploadedFile->getMimeType(),
                        'allowed' => $allowedMimeTypes
                    ], Response::HTTP_BAD_REQUEST);
                }

                $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
                $safeFilename = $slugger->slug($originalFilename);
                $newFilename = $safeFilename . '-' . uniqid() . '.' . $uploadedFile->guessExtension();

                try {
                    $uploadedFile->move(
                        $this->getParameter('project_images_directory'),
                        $newFilename
                    );

                    // Supprimer l'ancienne image si elle existe
                    if ($project->getImage()) {
                        $oldImagePath = $this->getParameter('project_images_directory') . '/' . $project->getImage();
                        if (file_exists($oldImagePath)) {
                            unlink($oldImagePath);
                        }
                    }

                    $project->setImage($newFilename);
                } catch (FileException $e) {
                    return new JsonResponse(['error' => 'Erreur lors du téléchargement de l\'image: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
                }
            }

            $entityManager->flush();

            // Sérialiser et retourner le projet mis à jour
            $jsonProject = $serializer->serialize($project, 'json', ['groups' => 'read']);
            return new JsonResponse($jsonProject, Response::HTTP_OK, [], true);
        } catch (\Exception $e) {
            // Retourner une erreur JSON au lieu de laisser Symfony générer une page d'erreur HTML
            return new JsonResponse([
                'error' => 'Une erreur est survenue lors de la mise à jour du projet',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/api/projects/{id}/image', name: 'project_upload_image', methods: ['POST'])]
    public function uploadImage(
        Request $request,
        Project $project,
        EntityManagerInterface $entityManager,
        SluggerInterface $slugger
    ): JsonResponse {
        $uploadedFile = $request->files->get('image');

        if (!$uploadedFile) {
            throw new BadRequestHttpException('Aucune image n\'a été uploadée.');
        }

        $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $slugger->slug($originalFilename);
        $newFilename = $safeFilename . '-' . uniqid() . '.' . $uploadedFile->guessExtension();

        try {
            $uploadedFile->move(
                $this->getParameter('project_images_directory'),
                $newFilename
            );

            $project->setImage($newFilename);
            $entityManager->flush();

            return new JsonResponse(['success' => true, 'filename' => $newFilename], Response::HTTP_OK);
        } catch (FileException $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/api/projects/test', name: 'project_test', methods: ['GET', 'POST'])]
    public function testEndpoint(Request $request): JsonResponse
    {
        // Créer un répertoire de log si nécessaire
        $logDir = $this->getParameter('kernel.project_dir') . '/var/log';
        if (!is_dir($logDir)) {
            mkdir($logDir, 0777, true);
        }

        // Écrire des informations de base dans le log
        $logFile = $logDir . '/test_endpoint.log';
        file_put_contents($logFile, date('Y-m-d H:i:s') . ' - Test endpoint called' . PHP_EOL, FILE_APPEND);

        // Collecter des informations sur la requête
        $data = [
            'method' => $request->getMethod(),
            'content_type' => $request->headers->get('Content-Type'),
            'post_data' => $request->request->all(),
            'query_data' => $request->query->all(),
            'files' => []
        ];

        // Informations sur les fichiers
        foreach ($request->files as $key => $file) {
            if ($file) {
                $data['files'][$key] = [
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getMimeType(),
                    'size' => $file->getSize()
                ];
            }
        }

        // Enregistrer ces informations dans le log
        file_put_contents($logFile, print_r($data, true) . PHP_EOL . PHP_EOL, FILE_APPEND);

        // Renvoyer ces informations comme réponse
        return new JsonResponse($data);
    }
}
