import type { NivelAcesso } from '@prisma/client';

declare namespace Prisma {
  interface Usuario {
    nivelAcesso: NivelAcesso[];
  }
}
