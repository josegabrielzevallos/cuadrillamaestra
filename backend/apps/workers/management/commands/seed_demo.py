"""
Carga datos de ejemplo realistas para Cuadrilla Maestra.

Uso:
    python manage.py seed_demo
"""
import random
from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from apps.workers.models import Category, Service, Worker
from apps.projects.models import Project
from apps.reviews.models import ClientReview, SupervisorEvaluation

User = get_user_model()


CATEGORIES = {
    'Gasfitería': ('plumbing', [
        'Detección y reparación de fugas',
        'Instalación de tuberías y grifería',
        'Mantenimiento de tanques y cisternas',
    ]),
    'Electricidad': ('electrical', [
        'Instalación de tableros eléctricos',
        'Cableado e iluminación',
        'Reparación de cortocircuitos',
    ]),
    'Pintura': ('paint', [
        'Pintado de interiores',
        'Pintado de fachadas',
        'Empastado y acabados',
    ]),
    'Albañilería': ('bricks', [
        'Construcción de muros',
        'Tarrajeo y enlucido',
        'Vaciado de concreto',
    ]),
    'Instalación de mayólica': ('tiles', [
        'Colocación de mayólica en pisos',
        'Enchapado de baños y cocinas',
        'Instalación de porcelanato',
    ]),
    'Remodelaciones': ('remodel', [
        'Remodelación de baños',
        'Remodelación de cocinas',
        'Ampliación de ambientes',
    ]),
    'Mano de obra general': ('handyman', [
        'Mantenimiento del hogar',
        'Reparaciones menores',
        'Apoyo en obra',
    ]),
}

ZONES = [
    'Lima Norte', 'Lima Sur', 'Lima Este', 'Cercado de Lima',
    'San Juan de Lurigancho', 'Comas', 'Villa El Salvador', 'Ate',
    'Los Olivos', 'Surco', 'San Martín de Porres', 'Callao',
]

FIRST_NAMES = ['Carlos', 'José', 'Miguel', 'Luis', 'Juan', 'Pedro', 'Jorge',
               'Manuel', 'Víctor', 'Raúl', 'Ángel', 'Roberto', 'Felipe', 'Marco']
LAST_NAMES = ['Quispe', 'Mamani', 'Huamán', 'Flores', 'Rojas', 'Vargas',
              'Castillo', 'Ramos', 'Torres', 'Chávez', 'Díaz', 'Espinoza']

COMMENTS = [
    'Excelente trabajo, muy puntual y ordenado.',
    'Cumplió con todo lo acordado, lo recomiendo.',
    'Buen trato y precio justo. Quedó muy bien.',
    'Trabajo limpio y rápido. Volvería a contratarlo.',
    'Profesional y responsable, dejó todo impecable.',
]

SUPERVISOR_COMMENTS = [
    'Cumple con los estándares de seguridad y calidad de Cuadrilla Maestra.',
    'Trabajador verificado, demuestra orden y dominio del oficio.',
    'Buen desempeño en obra, respeta los tiempos y normas de seguridad.',
]


class Command(BaseCommand):
    help = 'Carga categorías, servicios, trabajadores, proyectos y reseñas de ejemplo.'

    def handle(self, *args, **options):
        random.seed(42)
        self.stdout.write('Creando categorías y servicios...')
        service_map = {}
        category_objs = {}
        for cat_name, (icon, services) in CATEGORIES.items():
            cat, _ = Category.objects.get_or_create(
                name=cat_name,
                defaults={'icon': icon, 'description': f'Servicios de {cat_name.lower()}.'},
            )
            category_objs[cat_name] = cat
            service_map[cat_name] = []
            for s in services:
                svc, _ = Service.objects.get_or_create(category=cat, name=s)
                service_map[cat_name].append(svc)

        # Supervisor
        supervisor, created = User.objects.get_or_create(
            username='supervisor',
            defaults={'first_name': 'Andrés', 'last_name': 'Mendoza',
                      'role': User.Roles.SUPERVISOR, 'email': 'supervisor@cuadrillamaestra.com'},
        )
        if created:
            supervisor.set_password('Demo1234')
            supervisor.save()

        self.stdout.write('Creando obreros y maestros...')
        created_workers = 0
        for i in range(24):
            cat_name = random.choice(list(CATEGORIES.keys()))
            cat = category_objs[cat_name]
            fn = random.choice(FIRST_NAMES)
            ln = f'{random.choice(LAST_NAMES)} {random.choice(LAST_NAMES)}'
            username = f'worker{i+1}'
            if User.objects.filter(username=username).exists():
                continue
            user = User.objects.create(
                username=username, first_name=fn, last_name=ln,
                email=f'{username}@cuadrillamaestra.com',
                role=User.Roles.WORKER, phone=f'9{random.randint(10000000, 99999999)}',
            )
            user.set_password('Demo1234')
            user.save()

            wtype = random.choice([Worker.WorkerType.OBRERO, Worker.WorkerType.MAESTRO])
            headline = (f'Maestro {cat_name.lower()}' if wtype == Worker.WorkerType.MAESTRO
                        else f'{cat_name} profesional')
            worker = Worker.objects.create(
                user=user, worker_type=wtype, category=cat, headline=headline,
                bio=(f'Especialista en {cat_name.lower()} con amplia experiencia en '
                     f'proyectos residenciales y comerciales. Trabajo garantizado, '
                     f'puntual y con materiales de calidad.'),
                work_zone=random.choice(ZONES),
                years_experience=random.randint(2, 25),
                show_phone=random.choice([True, False]),
                is_verified=random.choice([True, True, False]),
            )
            worker.services.set(random.sample(service_map[cat_name],
                                              k=random.randint(1, len(service_map[cat_name]))))

            # Proyectos
            for p in range(random.randint(1, 3)):
                svc = random.choice(service_map[cat_name])
                Project.objects.create(
                    worker=worker, service=svc,
                    title=f'{svc.name} en {worker.work_zone}',
                    description=('Trabajo realizado respetando los plazos acordados, '
                                 'con acabados de calidad y limpieza final.'),
                    location=worker.work_zone,
                    work_date=date.today() - timedelta(days=random.randint(10, 600)),
                )

            # Reseñas de clientes
            for r in range(random.randint(2, 6)):
                ClientReview.objects.create(
                    worker=worker,
                    client_name=f'{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}',
                    rating=random.randint(3, 5),
                    comment=random.choice(COMMENTS),
                    service_hired=random.choice(service_map[cat_name]).name,
                )

            # Evaluación de supervisor (solo a algunos)
            if worker.is_verified and random.random() > 0.4:
                SupervisorEvaluation.objects.create(
                    worker=worker, supervisor=supervisor,
                    supervisor_name=supervisor.full_name,
                    punctuality=random.randint(3, 5),
                    work_quality=random.randint(3, 5),
                    cleanliness=random.randint(3, 5),
                    safety=random.randint(3, 5),
                    customer_treatment=random.randint(3, 5),
                    comment=random.choice(SUPERVISOR_COMMENTS),
                )
            created_workers += 1

        # Superusuario admin de demo
        if not User.objects.filter(username='admin').exists():
            admin = User.objects.create_superuser(
                username='admin', email='admin@cuadrillamaestra.com', password='Admin1234',
            )
            admin.role = User.Roles.ADMIN
            admin.save()
            self.stdout.write('Admin creado -> usuario: admin / clave: Admin1234')

        self.stdout.write(self.style.SUCCESS(
            f'Listo. {created_workers} trabajadores de ejemplo cargados.'
        ))
